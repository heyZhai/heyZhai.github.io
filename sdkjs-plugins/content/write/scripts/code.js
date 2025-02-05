/**
 *
 * (c) Copyright Ascensio System SIA 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function(window, undefined){

    window.Asc.plugin.init = function()
    {
		console.log('hello, 插件初始化~')
		$(document).ready(function() {
			$('#dataSelect').on('change', function(event) {
				var selectedData = $(this).val();
				if(selectedData !== '请选择') {
					postData(selectedData);
				}
			});

			function postData(data) {
				$.ajax({
					url: 'http://172.17.1.196:8007/ai-platform/task-template/type/dataListByType', // 替换为你的服务器端点
					type: 'POST',
					data: { type: data },
					success: function(response) {
						if($('.myDiv').length > 0) {
							$('.myDiv').remove()
						}
						console.log('请求成功，服务器响应：', response);
						// 处理服务器响应
						let writeList = response.data
						if(writeList.length > 0) {
							for (let i = 0; i < writeList.length; i++) {
								let item = $('<div></div>').addClass('myDiv'); // 使用 jQuery 创建并设置类名
								// 创建 span 元素并设置内容
								let codeDecSpan = $('<span class="code-dec"></span>').text(writeList[i].codeDec + '：'); // 使用 jQuery 创建 span 并设置文本内容
								// 将 span 元素添加到 div 中
								item.append(codeDecSpan);
								// 如果 writeList[i] 有 codeName 属性，则添加到 div 中
								if (writeList[i].codeName) {
									// let codeNameSpan = $('<div class="code-name"></div>').text(writeList[i].codeName)
									// $('<div class="code-name"></div>').setAttribute('isRemove', false)
									let codeNameSpan = $('<span></span>').addClass('code-name').text(writeList[i].codeName);
									codeNameSpan.attr({
										'isRemove': false // 根据您的注释，您可能想设置一个 'isRemove' 属性
									});
									item.append(codeNameSpan);
								}
								// 将整个 div 元素添加到页面上对应的容器中
								$('#iframe_parent').append(item);
							}
							$('.myDiv').on('click', '.code-name', function(event) {
								let text = event.currentTarget.innerText
								if (event.currentTarget.attributes[1].value === 'true') {
									window.Asc.plugin.executeMethod('SearchAndReplace', [
									{
										searchString: text,
										replaceString: '',
										matchCase: true
									}
									])
									event.currentTarget.attributes[1].value = 'false'
								} else {
									window.Asc.plugin.executeMethod('PasteText', [text])
									event.currentTarget.attributes[1].value = 'true'
								}
							})
						} else {
							let item = document.createElement('div')
							item.className = 'myDiv'
							item.innerText = '暂无撰写字符数据'
							document.getElementById('iframe_parent').appendChild(item)
						}
					},
					error: function(xhr, status, error) {
						console.error('请求失败：', error);
					}
				});
			}
		});
	
	
    window.Asc.plugin.button = function()
    {
		let number = 0
		var codeNameElements = $('.myDiv .code-name');
		// 遍历这些元素并执行操作
		codeNameElements.each(function(index, element) {
			// console.log('Element', index, 'text:', $(this).text());
			if(element.attributes[1].value === 'false') {
				number++
				alert($(this).text() + '字符串未使用');
			}
		});
		if(number === 0) {
			this.executeCommand("close", "");
		}
    };

	// window.Asc.plugin.onMethodReturn = function(returnValue)
	// {
	// 	//evend return for completed methods
	// 	var _plugin = window.Asc.plugin;
	// 	if (_plugin.info.methodName == "GetAllContentControls")
	// 	{
	// 		compareArr(returnValue);
	// 		fBtnGetAll = false;

	// 		document.getElementById("divG").innerHTML = "";
	// 		for (const key in ArrContentControls) {
	// 			addLabel(ArrContentControls[key], "#divG");
	// 		}
	// 	} 
	};
})(window, undefined);