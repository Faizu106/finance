const assert = require('node:assert/strict');
const {toMinor,sums,flowNet,validBackup} = require('../app.js');
assert.equal(toMinor('123.45'),12345);
assert.equal(toMinor('0.10'),10);
assert.throws(()=>toMinor('not money'));
const total=sums([
 {type:'income',amountMinor:100000},
 {type:'expense',amountMinor:2500},
 {type:'expense',amountMinor:1500},
 {type:'refund',amountMinor:500},
 {type:'transfer',amountMinor:20000},
]);
assert.equal(total.income,100000);
assert.equal(total.expenses,4000);
assert.equal(total.refunds,500);
assert.equal(flowNet(total),96500);
assert.equal(total.transfersIn,0);
const backup={app:'My Finance Tracker',schemaVersion:1,settings:{},categories:{income:[],expense:[]},transactions:[{id:'a',amountMinor:100,type:'income',date:'2026-10-14',category:'Salary'}],budgets:[],goals:[]};
assert.equal(validBackup(backup),true);
assert.throws(()=>validBackup({...backup,transactions:[...backup.transactions,...backup.transactions]}),/invalid or duplicate/);
assert.throws(()=>validBackup({...backup,transactions:[{...backup.transactions[0],amountMinor:0}]}),/invalid or duplicate/);
assert.throws(()=>validBackup({...backup,schemaVersion:9}),/not a supported/);
console.log('PASS: 11 calculation and backup-validation assertions');
