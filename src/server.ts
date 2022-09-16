import  express from "express";
import { PrismaClient } from "@prisma/client";

import  cors from "cors"

//funcação que converte hora em minuto
import * as helpers from "./utils/helpers";

const app = express()

app.use(cors()) //passando um atributo origin aponta o endereço do seu front assim só o seu site podera consumir sua api

//permito o express entender json para enviar meu body
app.use(express.json())

const prisma = new PrismaClient({
    log:['query']//com esse mano toda vez que chamarmos uma rota ele ira executar a query bruta sql
})

//cria o game para depois listar
app.get('/games', async (request,response)=> {
    const games = await prisma.game.findMany({
        include:{ //um join da vida
            _count:{
                select:{
                    ads:true
                }
            }
        }
    })
    return response.json(games)
})

//cria nossos games
app.post('/games', (request,response)=>{
    return response.json([])
})

//listagem de todos os anuncios
app.get('/ads', async (request,response)=>{
    const ads = await prisma.ad.findMany()
    return response.json(ads)
})

//cadastra nossos anuncios
app.post('/games/:gameId/ads', async(request,response)=>{

    const gameId = request.params.gameId

    const body: any = request.body //esse any é para ser qualquer budega no caso os valores

    //ter validação
    //tem uma biblioteca que chama ZOD js

    const ads = await prisma.ad.create({
        data:{
            gameId: gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: helpers.converHoursInMinutes(body.hourStart),
            hourEnd: helpers.converHoursInMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel
        }
    })

    return response.status(201).json(ads)
})

//lista todos os anuncios de um game
app.get('/games/:id/ads', async (request,response)=>{
    const id = request.params.id

    const GameAds = await prisma.ad.findMany({
        select:{//seleciona os campos
            id: true,
            name: true,
            game: true,
            gameId: true,
            useVoiceChannel: true,
            weekDays: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
            createdAt: true
        },
        where:{
            gameId:id 
        },
        orderBy:{
            createdAt: 'desc'
        }
    })

    return response.json(GameAds.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),//forma o meu mano dias da semana em array para facilitar no meu front-end
            hourStart: helpers.convertMinutesAndHours(ad.hourStart),
            hourEnd: helpers.convertMinutesAndHours(ad.hourEnd)
        }
    }))
})

//lista o nick name do dicord de cada anuncio
app.get('/ads/:id/discord', async (request,response)=>{
    const adId = request.params.id


    const NickDiscord = await prisma.ad.findUniqueOrThrow({//era pra retornar um erro amigavel pelo visto, mais nao funciona assim exatamente
        select:{
            discord: true
        },
        where:{
            id: adId
        }
    })

    return response.json(NickDiscord)
})


app.listen(20021)