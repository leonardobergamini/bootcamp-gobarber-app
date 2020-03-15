const Yup = require('yup');
const { startOfHour, isBefore, parseISO, format } = require('date-fns');
const ptBr = require('date-fns/locale/pt');

const Appointment = require('../models/Appointment');
const User = require('../models/User');
const File = require('../models/File');
const Notification = require('../schemas/Notification');

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      // quantos registros deseja pular
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Erro na validação. Campos obrigatórios.',
      });
    }

    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Provedor não encontrado.',
      });
    }

    if (provider_id === req.userId) {
      return res.status(401).json({
        error:
          'Provedor e usuário logado são os mesmos. Não é possível fazer esse agendamento.',
      });
    }

    /**
     * Checar se data é superior a data de hoje
     */
    const userDate = startOfHour(parseISO(date));

    const isFutureDate = isBefore(userDate, new Date());

    if (isFutureDate) {
      return res.status(400).json({
        error: 'Data inválida. Data deve ser superior a hoje.',
      });
    }

    /**
     * Checar se provedor já possue agendamento para o horário informado
     */

    const isAvaiableDate = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: userDate,
      },
    });

    if (isAvaiableDate) {
      return res.status(400).json({
        error: 'Data indisponível.',
      });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      date,
      provider_id,
    });

    /**
     * Notificar agendamento para o provider
     */
    const user = await User.findByPk(req.userId);
    const dataFormatada = format(userDate, "'dia' dd 'de' MMMM', às' H:mm'h'", {
      locale: ptBr,
    });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${dataFormatada}`,
      user: provider_id,
    });

    return res.json(appointment);
  }
}

module.exports = new AppointmentController();
