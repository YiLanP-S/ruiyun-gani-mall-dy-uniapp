// 请求接口

const commoneUrl = "https://www.tmsglm.com/";
// new 域名
 
//post请求封装
function postRequest(url, data ,headerData) {
	var promise = new Promise((resolve, reject) => {
		var postData = data;
		var header = {
			'content-type': 'application/json',
			'Authorization':uni.getStorageSync('token')
		}
		if(headerData){
			header['content-type'] = headerData['content-type']
		}
		uni.request({
			url: commoneUrl + url,
			data: postData,
			method: 'POST',
			header: header,
			success: function(res) {
				
				if (res.statusCode === 200 && res.data.code == 0) {
					resolve(res.data);
				} else if(res.data.code == 401){
					// uni.navigateTo({
					// 	url: '/pages/login/login'
					// })
					uni.removeStorageSync('token')
					uni.removeStorageSync('userId')
					uni.removeStorageSync('isDistributo')
					console.log(`清除缓存删除成功`)
					resolve(res.data); 
				} else {
					resolve(res.data)
				}
			},
			error: function(e) {
				reject('网络出错');
			}
		})
	});
	return promise;
}
 
//get请求封装
function getRequest(url, queryParams = {}) {  
    // 构建完整的URL，如果有查询参数，则附加到URL上  
    var fullUrl = commoneUrl + url;  
    if (Object.keys(queryParams).length > 0) {  
        var queryString = Object.keys(queryParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`).join('&');  
        fullUrl += `?${queryString}`;  
    }  
  
    var promise = new Promise((resolve, reject) => {  
        uni.request({  
            url: fullUrl,  
            method: 'GET',  
            // 对于GET请求，通常不需要设置data属性，因为数据通过URL传递  
            // 但如果你需要设置其他请求选项，可以在这里添加 
			 header: {
			 	'content-type': 'application/json',
			 	'Authorization':uni.getStorageSync('token')
			 },
            success: function(res) {  
                // 检查响应状态码和结果码（如果有的话）  
                if (res.statusCode === 200 && res.data.code === 0) {  
                    resolve(res.data);  
                }  else if(res.data.code == 401){
					// uni.navigateTo({
					// 	url: '/pages/login/login'
					// })
					uni.removeStorageSync('token')
					uni.removeStorageSync('userId')
					uni.removeStorageSync('isDistributo')
					console.log(`清除缓存删除成功`)
					resolve(res.data); 
				}else {  
                    // 根据你的应用逻辑，你可能想在这里reject而不是resolve  
                    // reject(new Error('请求失败或数据错误'));  
                    // 但为了与postRequest保持一致，这里仍然resolve  
                    resolve(res.data);  
                }  
            },  
            fail: function(e) { // 注意：uni.request中使用fail而不是error  
                reject('网络出错');  
            }  
        });  
    });  
  
    return promise;  
} 
 
//put请求封装
function putRequest(url, queryParams = {}, data) {  
    // 构建完整的URL，如果有查询参数，则附加到URL上  
	var postData = data;
    var fullUrl = commoneUrl + url;  
    if (Object.keys(queryParams).length > 0) {  
        var queryString = Object.keys(queryParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`).join('&');  
        fullUrl += `?${queryString}`;  
    }  
  
    var promise = new Promise((resolve, reject) => {  
        uni.request({  
            url: fullUrl, 
            method: 'PUT',
			data: postData,
            // 对于GET请求，通常不需要设置data属性，因为数据通过URL传递  
            // 但如果你需要设置其他请求选项，可以在这里添加 
			 header: {
			 	'content-type': 'application/json',
			 	'Authorization':uni.getStorageSync('token')
			 },
            success: function(res) {  
                // 检查响应状态码和结果码（如果有的话）  
                if (res.statusCode === 200 && res.data.code === 0) {  
                    resolve(res.data);  
                }  else if(res.data.code == 401){
					// uni.navigateTo({
					// 	url: '/pages/login/login'
					// })
					uni.removeStorageSync('token')
					uni.removeStorageSync('userId')
					uni.removeStorageSync('isDistributo')
					console.log(`清除缓存删除成功`)
					resolve(res.data); 
				}else {  
                    // 根据你的应用逻辑，你可能想在这里reject而不是resolve  
                    // reject(new Error('请求失败或数据错误'));  
                    // 但为了与postRequest保持一致，这里仍然resolve  
                    resolve(res.data);  
                }  
            },  
            fail: function(e) { // 注意：uni.request中使用fail而不是error  
                reject('网络出错');  
            }  
        });  
    });  
  
    return promise;  
}  
//put请求封装
function putNewRequest(url, data) {  
    // 构建完整的URL，如果有查询参数，则附加到URL上  
	var postData = data;
    var fullUrl = commoneUrl + url;  
  
    var promise = new Promise((resolve, reject) => {  
        uni.request({  
            url: fullUrl, 
            method: 'PUT',
			data: postData,
            // 对于GET请求，通常不需要设置data属性，因为数据通过URL传递  
            // 但如果你需要设置其他请求选项，可以在这里添加 
			 header: {
			 	'content-type': 'application/json',
			 	'Authorization':uni.getStorageSync('token')
			 },
            success: function(res) {  
                // 检查响应状态码和结果码（如果有的话）  
                if (res.statusCode === 200 && res.data.code === 0) {  
                    resolve(res.data);  
                }  else if(res.data.code == 401){
					// uni.navigateTo({
					// 	url: '/pages/login/login'
					// })
					uni.removeStorageSync('token')
					uni.removeStorageSync('userId')
					uni.removeStorageSync('isDistributo')
					console.log(`清除缓存删除成功`)
					resolve(res.data); 
				}else {  
                    // 根据你的应用逻辑，你可能想在这里reject而不是resolve  
                    // reject(new Error('请求失败或数据错误'));  
                    // 但为了与postRequest保持一致，这里仍然resolve  
                    resolve(res.data);  
                }  
            },  
            fail: function(e) { // 注意：uni.request中使用fail而不是error  
                reject('网络出错');  
            }  
        });  
    });  
  
    return promise;  
}  
 //delete请求封装
 function deleteRequest(url, queryParams = {}) {  
     // 构建完整的URL，如果有查询参数，则附加到URL上  
     var fullUrl = commoneUrl + url;  
     if (Object.keys(queryParams).length > 0) {  
         var queryString = Object.keys(queryParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`).join('&');  
         fullUrl += `?${queryString}`;  
     }  
   
     var promise = new Promise((resolve, reject) => {  
         uni.request({  
             url: fullUrl,  
             method: 'DELETE',  
             // 对于GET请求，通常不需要设置data属性，因为数据通过URL传递  
             // 但如果你需要设置其他请求选项，可以在这里添加 
 			 header: {
 			 	'content-type': 'application/json',
 			 	'Authorization':uni.getStorageSync('token')
 			 },
             success: function(res) {  
                 // 检查响应状态码和结果码（如果有的话）  
                 if (res.statusCode === 200 && res.data.code === 0) {  
                     resolve(res.data);  
                 }  else if(res.data.code == 401){
 					// uni.navigateTo({
 					// 	url: '/pages/login/login'
 					// })
					uni.removeStorageSync('token')
					uni.removeStorageSync('userId')
					uni.removeStorageSync('isDistributo')
					console.log(`清除缓存删除成功`)
 					resolve(res.data); 
 				}else {
                     // 根据你的应用逻辑，你可能想在这里reject而不是resolve  
                     // reject(new Error('请求失败或数据错误'));  
                     // 但为了与postRequest保持一致，这里仍然resolve  
                     resolve(res.data);  
                 }  
             },  
             fail: function(e) { // 注意：uni.request中使用fail而不是error  
                 reject('网络出错');  
             }  
         });  
     });  
   
     return promise;  
 } 
module.exports = {
	getRequest,
	postRequest,
	putRequest,
	putNewRequest,
	deleteRequest,
	commoneUrl
}