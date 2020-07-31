const { donateProject, submit } = require('../components/transactions/transactions') 

export default function donateProjectAction(doc){

  let transaction = donateProject(doc.privKey, doc.project, doc.amount)
  transaction = Buffer.from(transaction).toString("base64");
  const request = submit({ txn: transaction }, true)
  .then((response) => response.data)
  return {
      type:'USER_DONATE_PROJECT',
      payload:request
  }
}