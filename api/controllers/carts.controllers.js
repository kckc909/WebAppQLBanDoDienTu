const model = require('../models/carts.models');

async function getAll(req, res){
  try{
    const rows = await model.getAll();
    res.json(rows);
  }catch(err){
    console.error(err); res.status(500).json({ error: err.message });
  }
}

async function getById(req, res){
  try{
    const row = await model.getById(req.params.id);
    if(!row) return res.status(404).json({});
    res.json(row);
  }catch(err){ console.error(err); res.status(500).json({ error: err.message }); }
}

async function create(req, res){
  try{
    const id = await model.create(req.body);
    res.json({ id });
  }catch(err){ console.error(err); res.status(500).json({ error: err.message }); }
}

async function update(req, res){
  try{
    const r = await model.update(req.params.id, req.body);
    res.json({ affected: r });
  }catch(err){ console.error(err); res.status(500).json({ error: err.message }); }
}

async function remove(req, res){
  try{
    const r = await model.remove(req.params.id);
    res.json({ affected: r });
  }catch(err){ console.error(err); res.status(500).json({ error: err.message }); }
}

module.exports = { getAll, getById, create, update, remove };
