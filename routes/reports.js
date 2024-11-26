const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prismaClient");

router.get("/lists/:id", async (req, res) => {
  try {
    const data = await prisma.report_lists.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.get("/lists", async (req, res) => {
  try {
    const data = await prisma.report_lists.findMany({
      where: { company_id: req.query.company_id },
    });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/", async (req, res) => {
  const listId = req.query.list_id
  
  try {
    const data = await prisma.reports.findMany({
      where: { list_id: listId },
      orderBy: {param_id:'asc'},
      select: {
        id: true,
        param_id: true,
        param_value: true,
        parametres: {
          select: {
            title: true,
            measurement_unit: true,
            desc: true,
          }
        }
      }
    });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.put("/", async (req, res) => {
  try {
    const Data = req.body
    let newData = []
    Data.map(async (param)=>{
      const updatedData = await prisma.reports.update({
        where: { id: param.id },
        data:{
          param_value: Number(param.param_value)
        },
      });
      newData.push(updatedData)
    })
    res.status(200).json(newData);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.delete("/lists/:id", async (req,res)=>{
  try {
    const deleteData = await prisma.report_lists.delete({
      where: {id:req.params.id}
    })
    res.status(200).json(deleteData)
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
})
router.post("/", async (req, res) => {
  let Data = req.body;
  try {
    const list = await prisma.report_lists.create({
      data: {
        company_id: Data[0].company_id,
        created_at: Data[0].date,
      },
    });

    newParam1 = {
        list_id: list.id,
        param_id: 200,
        param_value: (Number(Data[10].param_value)+Number(Data[11].param_value))/Number(Data[14].param_value),
    };
    Data.push(newParam1)
    
    newParam2 = {
        list_id: list.id,
        param_id: 201,
        param_value: (Number(Data[10].param_value)+Number(Data[11].param_value)+Number(Data[9].param_value))/Number(Data[14].param_value),
    };
    Data.push(newParam2)

    newParam3 = {
        list_id: list.id,
        param_id: 202,
        param_value: Number(Data[6].param_value)/(Number(Data[14].param_value)+Number(Data[15].param_value)),
    };
    Data.push(newParam3)

    newParam4 = {
        list_id: list.id,
        param_id: 203,
        param_value: Number(Data[6].param_value)-Number(Data[14].param_value),
    };
    Data.push(newParam4)

    newParam5 = {
        list_id: list.id,
        param_id: 300,
        param_value: Number(Data[14].param_value)/Number(Data[12].param_value),
    };
    Data.push(newParam5)

    newParam6 = {
        list_id: list.id,
        param_id: 301,
        param_value: Number(Data[12].param_value)/(Number(Data[1].param_value)+Number(Data[6].param_value)+Number(Data[12].param_value)+Number(Data[13].param_value)+Number(Data[14].param_value)+Number(Data[15].param_value)+Number(Data[16].param_value)),
    };
    Data.push(newParam6)

    newParam7 = {
        list_id: list.id,
        param_id: 302,
        param_value: Number(Data[12].param_value)/Number(Data[14].param_value),
    };
    Data.push(newParam7)

    newParam8 = {
        list_id: list.id,
        param_id: 303,
        param_value: (Number(Data[12].param_value)+Number(Data[13].param_value))/(Number(Data[1].param_value)+Number(Data[6].param_value)+Number(Data[12].param_value)+Number(Data[13].param_value)+Number(Data[14].param_value)+Number(Data[15].param_value)+Number(Data[16].param_value)),
    };
    Data.push(newParam8)
    Data.shift()
    Data.map((obj)=>{
        obj.list_id=list.id
        obj.param_value = Number(obj.param_value)
    })
    const reports = await prisma.reports.createMany({
        data: Data,
    })
    
    res.status(200).json(reports);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
module.exports = router;
