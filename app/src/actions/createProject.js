const { createProject, submit } = require('../components/transactions/transactions') 

export default function createProjectAction(doc){

  let transaction = createProject(doc.privKey, doc.name, doc.description, doc.goal)
  transaction = Buffer.from(transaction).toString("base64");
  const request = submit({ txn: transaction }, true)
  .then((response) => response.data)
  return {
      type:'USER_CREATE_PROJECT',
      payload:request
  }
}