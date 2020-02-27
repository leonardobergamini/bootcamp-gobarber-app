const Yup = require('yup');
const { startOfHour, isBefore, parseISO } = require('date-fns');

const Appointment = require('../models/Appointment');
const User = require('../models/User');

class AppointmentController {
    async store(req, res) {
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json(
                { 
                    error: 'Erro na validação. Campos obrigatórios.'
                });
        }

        const { provider_id, date } = req.body;

        const isProvider = await User.findOne({
            where: { 
                id: provider_id,
                provider: true
            }
        });

        if (!isProvider) {
            return res.status(401).json(
                { 
                    error: 'Provedor não encontrado.'
                });
        }

        /**
         * Checar se data é superior a data de hoje
         */
        const userDate= startOfHour(parseISO(date));

        const isFutureDate = isBefore(userDate, new Date());

        if (isFutureDate) {
            return res.status(400).json(
                { 
                    error: 'Data inválida. Data deve ser superior a hoje.'
                }); 
        }

        /**
         * Checar se provedor já possue agendamento para o horário informado
         */

        const isAvaiableDate = await Appointment.findOne({
            where: {
            provider_id,
            canceled_at: null,
            date: userDate
            }
        });
        
        if (isAvaiableDate) {
            return res.status(400).json(
                { 
                    error: 'Data indisponível.'
                }); 
        }

        const appointment = await Appointment.create({
           user_id: req.userId,
           date,
           provider_id 
        });

        res.json(appointment);
    }
}

module.exports = new AppointmentController();