const fs = require('fs');




const userData = () => {
  const userFiles = ['./server/data/users_mock_data.json'];
  const jsonData = [];
  for (const file of userFiles) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    jsonData.push(...data);
  }
  return jsonData;
}

module.exports = { userData };