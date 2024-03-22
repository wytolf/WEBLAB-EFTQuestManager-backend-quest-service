require('dotenv').config();
const express = require('express');
const winston = require('winston');

const initializeApp = require('firebase/app');
const {getFirestore, collection, getDocs, doc, getDoc, setDoc} = require('firebase/firestore');

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

function main() {
    const server = express();
    server.use(express.json())

    const app = initializeApp.initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.align(),
            winston.format.printf(info => `${info.timestamp} ${info.service} ${info.level}: ${info.message}`)
        ),
        defaultMeta: {service: 'quest-service'},
        transports: [
            new winston.transports.Console(),
        ],
    });

    server.listen(process.env.PORT, () => {
        logger.info('Server is listening');
    });

    server.get('/api/quests', async (req, res) => {
        logger.info(`GET /api/quests wurde aufgerufen.`);

        try {
            const questList = await getAllQuests(db);
            res.status(200).json(questList);
            logger.info(`GET /api/quests -> Daten erfolgreich gesendet`);
        } catch (error) {
            logger.error('GET /api/quests -> Error fetching quests:', error);
            res.status(500).send('GET /api/quests -> Internal Server Error');
        }
    });

    server.post('/api/quests', async (req, res) => {
        logger.info(`POST /api/quests wurde aufgerufen.`);

        const {title, map, trader, link} = req.body;
        logger.info('POST /api/quests -> Request received { title: ' + title + ' }');
        try {
            await setDoc(doc(db, "quests", title), {
                link: link,
                map: map,
                title: title,
                trader: trader
            });
            logger.info('POST /api/quests -> Quest erfolgreich hinzugefügt. { title: ' + title + ' }');
            res.status(200).send();
        } catch (error) {
            logger.error('GET /api/quests -> Error fetching quests:', error);
            res.status(500).send('GET /api/quests -> Internal Server Error');
        }

    });

    server.get('/api/quests/:id', async (req, res) => {
        const id = req.params.id;
        logger.info(`GET /api/quests/` + id + ` wurde aufgerufen.`);

        try {
            const questDocument = doc(db, "quests", id);
            const questSnapshot = await getDoc(questDocument);


            if (questSnapshot.exists()) {
                let quest = questSnapshot.data();
                logger.info(`GET /quests/` + id + ` -> quest gefunden` + quest);
                res.status(200).json(quest);
                logger.info(`GET /quests/` + id + ` -> Daten erfolgreich gesendet`);
            } else {
                logger.info("GET /quests/" + id + " -> Document existiert nicht in db");
                res.status(404).send("GET /quests/" + id + ' -> Quest nicht gefunden');
            }
        } catch
            (error) {
            logger.error('Quest Service: GET /api/quests/' + id + ' -> Error fetching quest:', error);
            res.status(500).send('GET /api/quests ' + id + ' -> Error fetching quest:' + error);
        }
    });

    async function getAllQuests(db) {
        const quests = collection(db, 'quests');
        const questsSnapshot = await getDocs(quests);
        return  questsSnapshot.docs.map(doc => doc.data());
    }
}


main();