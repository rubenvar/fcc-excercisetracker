const router = require('express').Router();
const { User } = require('./models');

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

router.post('/api/exercise/new-user', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.json({ error: 'no username provided' });
  // save
  let saved;
  try {
    saved = await new User({ username }).save();
  } catch (err) {
    console.log(err);
    if (err.code === 11000) return res.json({ error: `username '${err.keyValue.username}' already exists` });
  }
  if (!saved) return res.json({ error: 'user not saved' });
  return res.json({ _id: saved._id, username: saved.username });
});

router.get('/api/exercise/users', async (req, res) => {
  const fullUsers = await User.find();
  const users = fullUsers.map(({ _id, username }) => ({ _id, username }));
  if (!users) return res.json({ error: 'no users found 🤷‍♂️' });
  res.json(users);
});

router.post('/api/exercise/add', async (req, res) => {
  // get data
  const { userId, description, duration, date } = req.body;
  // find username (for json resp only 🤷‍♂️)
  const { username } = await User.findOne({ _id: userId }).select('username -_id');
  if (!username) return res.json({ error: 'no user found' });
  // process data
  const updates = { description, duration };
  updates.date = date || new Date();
  // store data
  const updated = await User.updateOne({ _id: userId }, { $push: { log: updates } });
  // return
  if (updated.nModified < 1) return res.json({ error: 'some error' });
  res.json({
    _id: userId,
    username,
    description,
    duration: +duration,
    date: new Date(updates.date).toDateString(),
  });
});

router.get('/api/exercise/log', async (req, res) => {
  const { userId, from, to, limit } = req.query;
  console.log({ userId, from, to, limit });
  // get full user
  const user = await User.findById(userId);
  if (!user) return res.json({ error: `No user found for id ${userId}` });
  // filter the logs
  let logs = user.log;
  if (from) logs = logs.filter(log => new Date(log.date) >= new Date(from));
  if (to) logs = logs.filter(log => new Date(log.date) <= new Date(to));
  if (limit) logs = logs.slice(0, +limit);
  // out
  const count = logs.length;
  res.json({
    _id: user._id,
    username: user.username,
    count,
    log: logs,
  })
})

module.exports = router;