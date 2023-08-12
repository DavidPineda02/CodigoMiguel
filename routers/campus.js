import { plainToClass } from 'class-transformer';
import { con } from "../db/atlas.js";
import { limitGrt } from "../limit/config.js";
import { middlewareVerify, DTOData } from "../middleware/campus.js";
import { DTO } from "../limit/token.js";
import { Router } from "express";

const appCampus = Router();  

let db = await con();
let usuario = db.collection("usuario");

appCampus.get("/", limitGrt(), middlewareVerify, async(req, res) => {
    if(!req.rateLimit) return; 
    let db = await con();
    let usuario = db.collection("usuario");
    let result = await usuario.find({}).toArray();
    res.send(result);
});

appCampus.post("/", limitGrt(), middlewareVerify, DTOData, async(req, res) => {
    let resul;
    try {
        resul = await usuario.insertOne(req.body);
        res.status(201).send(resul);
    } catch (error) {
        console.log(plainToClass(DTO("mongo").class, error.errInfo.details.schemaRulesNotSatisfied));
        // console.log(error.errInfo.details.schemaRulesNotSatisfied);
        res.send();
    }
});
export default appCampus; 