const timestampToTimes = (timestamp) => {
    let date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-'
    let M =
        (date.getMonth() + 1 < 10 ?
            '0' + (date.getMonth() + 1) :
            date.getMonth() + 1) + '-'
    let D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '

    return Y + M + D 
};
const timestampToTime = (timestamp) => {
    let date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let Y = date.getFullYear() + '-'
    let M =
        (date.getMonth() + 1 < 10 ?
            '0' + (date.getMonth() + 1) :
            date.getMonth() + 1) + '-'
    let D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    let h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    let m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())  + ':'
	let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + M + D + h + m + s
};
const timestampyue = (timestamp) => {
    let date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-'
    let M =
        (date.getMonth() + 1 < 10 ?
            '0' + (date.getMonth() + 1) :
            date.getMonth() + 1) + '-'
    let D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '

    return M + D 
};

function getstatus(lx){
	if(lx==1){return "待接单"; }
	else if(lx==2){return "已接单"; }
	else if(lx==3){return "派送中"; }
	else if(lx==4){return "已送达"; }
	else if(lx==5){return "已签收"; }
	else if(lx==6){return "已评价"; }
	else if(lx==9){return "订单取消"; }
}

function getcanshu(lx){
	let name="";
	
	if(lx==1){return "待接单"; }
	else if(lx==2){return "已接单"; }
	else if(lx==3){return "派送中"; }
	else if(lx==4){return "已送达"; }
	else if(lx==5){return "已签收"; }
	else if(lx==6){return "已评价"; }
	else if(lx==9){return "订单取消"; }
}
function formatOrderStatus(order) {
  if (order.status === 0) {
    return '待付款';
  }
  if (order.status === 10) {
    return '待发货';
  }
  if (order.status === 20) {
    return '待收货';
  }
  if (order.status === 21 && order.items[0].afterSaleStatus === 0) {
    return '待预约';
  }
  if (order.status === 22 && order.items[0].afterSaleStatus === 0) {
    return '待派单';
  }
  if (order.status === 23) {
    return '待上门';
  }
  if (order.status === 24) {
    return '待施工';
  }
  if (order.status === 26) {
    return '施工中';
  }
  if (order.status === 27) {
    return '已派单';
  }
  if (order.status === 25) {
    return '待验收';
  }
  if (order.status === 28) {
    return '待付余款';
  }
  if (order.status === 30) {
    return '已完成';
  }
  if (order.status === 40) {
    return '已取消';
  }
  if ((order.status === 21 || order.status === 22) && order.items[0].afterSaleStatus === 10) {
    return '售后中';
  }
  if ((order.status === 21 || order.status === 22) && order.items[0].afterSaleStatus === 20) {
    return '售后成功';
  }
  return '';
}
function handleOrderButtons(order) {
  order.buttons = []
  if (order.type === 3) { // 查看拼团
    order.buttons.push('combination');
  }
  if (order.status === 20) { // 确认收货
    order.buttons.push('confirm');
  }
  if (order.logisticsId > 0) { // 查看物流
    order.buttons.push('express');
  }
  if (order.status === 0) { // 取消订单 / 发起支付
    order.buttons.push('cancel');
    order.buttons.push('pay');
  }
  if (order.status === 30 && !order.commentStatus) { // 发起评价
    order.buttons.push('comment');
  }
  if (order.status === 30 && !order.workCommentStatus ) { // 发起评价师傅
    order.buttons.push('commentWorker');
  }
  if(order.workCommentStatus){
	  order.buttons.push('viewWorkerComment');
  }
  if (order.status === 40) { // 删除订单
    order.buttons.push('delete');
  }

  // 是否有预约按钮
  if(order.status===21 && order.items[0].afterSaleStatus === 0 ){
    order.buttons.push('appointment')
  }else if(order.status > 0 && order.status < 23 && order.allowModifyAppointmentTime ){
    order.buttons.push('changeAppointment')
  }
  if (order.status === 22) { // 取消预约
    order.buttons.push('cancelAppointment');
  }
  if (order.status === 25) { // 待验证
    order.buttons.push('check');
  }
  if(order.status===28){
  	  order.buttons.push('finishPay')
  }
  if ((order.status === 25 || order.status === 28 || order.status === 30) ) { // 
    order.buttons.push('construction'); // 查看施工
  }
  if (order.status===21 && order.items[0].afterSaleStatus === 0) { //
    order.buttons.push('afterSales'); // 查看施工
  }
}
/**
 * 格式化售后状态
 *
 * @param afterSale 售后
 */
function formatAfterSaleStatus(afterSale) {
  if (afterSale.status === 10) {
    return '申请售后';
  }
  if (afterSale.status === 20) {
    return '处理中';
  }
  if (afterSale.status === 30) {
    return '商家待收货';
  }
  if (afterSale.status === 40) {
    return '等待退款';
  }
  if (afterSale.status === 50) {
    return '处理成功';
  }
  if (afterSale.status === 61) {
    return '买家取消';
  }
  if (afterSale.status === 62) {
    return '平台拒绝';
  }
  if (afterSale.status === 63) {
    return '商家拒收货';
  }
  return '未知状态';
}

/**
 * 格式化售后状态的描述
 *
 * @param afterSale 售后
 */
function formatAfterSaleStatusDescription(afterSale) {
  if (afterSale.status === 10) {
    return '退款申请待商家处理';
  }
  if (afterSale.status === 20) {
    return '请退货并填写物流信息';
  }
  if (afterSale.status === 30) {
    return '退货退款申请待商家处理';
  }
  if (afterSale.status === 40) {
    return '等待退款';
  }
  if (afterSale.status === 50) {
    return '退款成功';
  }
  if (afterSale.status === 61) {
    return '退款关闭';
  }
  if (afterSale.status === 62) {
    return `商家不同意退款申请，拒绝原因：${afterSale.auditReason}`;
  }
  if (afterSale.status === 63) {
    return `商家拒绝收货，不同意退款，拒绝原因：${afterSale.auditReason}`;
  }
  return '未知状态';
}

/**
 * 处理售后的 button 操作按钮数组
 *
 * @param afterSale 售后
 */
function handleAfterSaleButtons(afterSale) {
  afterSale.buttons = [];
  if ([10, 20, 30].includes(afterSale.status)) { // 取消订单
    afterSale.buttons.push('cancel');
  }
  if (afterSale.status === 20) { // 退货信息
    afterSale.buttons.push('delivery');
  }
}
/**
 * 导出 
 **/
export {
    timestampToTimes,
	timestampToTime,
	timestampyue,
	getstatus,
	formatOrderStatus,
	handleOrderButtons,
	formatAfterSaleStatus,
	formatAfterSaleStatusDescription,
	handleAfterSaleButtons
}