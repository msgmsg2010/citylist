/**
 * Created by msg
 * date: 2015/12/24.
 * intro: city list show and querySelect
 */

// 初始化
var city = city || {};

// 配置文件
var config = {
  eleCityPanel: "cityPanel",          // id
  eleCityPanelList: "cityPanelList",  // 城市选择list
  eleCityArea:"cityArea",             // 地区选择list

  eleDomestic: "domestic",            // 国内选项卡id
  eleDomesticTab: "nativeTab",        // 国内选项卡航班标题id
  eleDomesticBody: "nativeCityList",  // 国内选项卡航班城市id
  eleDomesBox:"nativeCityBox",

  eleInt:"inter",                     // 国际选项卡id
  eleIntTab:"interTab",               // 国际选项卡航班标题id
  eleIntBody:"interCityList",         // 国际选项卡航班城市id
  eleIntBox:"interCityBox",

  eleCityClose: "cityClose",          // 关闭按钮

  elePinYin: "pinYinSearch",          // 拼音查询控制节点id
  elePinYinCont: "address_list"       // 拼音显示内容box id
};

// city操作
city.cityOperation = {

  // 当前作用域
  _self: this,

  // input 标签绑定
  inputEle: null,

  // Element
  eleDomestic: null,        // 国内选项卡节点
  eleDomesticTab: null,     // 国内选项卡航班标题Tab节点
  eleDomesticBody: null,    // 国内选项卡航班主体Body节点
  eleDomesBox:null,

  eleInt: null,            // 国际选项卡节点
  eleIntTab: null,         // 国际选项卡航班标题Tab节点
  eleIntBody: null,        // 国际选项卡航班主体Body节点
  eleIntBox:null,

  eleCityClose: null,       // 关闭按钮
  eleCityPanel: null,       // root 节点
  eleCityPanelList: null,   // 城市选择list box
  eleCityArea:null,         //地区选择list box

  // 控件显示左上角
  eleTop: null,           // 坐标
  eleLeft: null,          // 坐标
  elePinYin: null,        // 拼音节点
  elePinYinCont: null,    // 拼音内容节点
  searchValuePre: "",     // 保存上一次查询关键字

  // 初始化
  init: function () {
    // Element 绑定
    this.eleDomestic = document.getElementById(config.eleDomestic);
    this.eleDomesticTab = document.getElementById(config.eleDomesticTab);
    this.eleDomesticBody = document.getElementById(config.eleDomesticBody);
    this.eleDomesBox=document.getElementById(config.eleDomesBox);

    this.eleInt = document.getElementById(config.eleInt);
    this.eleIntTab = document.getElementById(config.eleIntTab);
    this.eleIntBody = document.getElementById(config.eleIntBody);
    this.eleIntBox=document.getElementById(config.eleIntBox);

    this.eleCityClose = document.getElementById(config.eleCityClose);
    this.eleCityPanel = document.getElementById(config.eleCityPanel);
    this.eleCityArea = document.getElementById(config.eleCityArea);
    this.elePinYin = document.getElementById(config.elePinYin);
    this.elePinYinCont = document.getElementById(config.elePinYinCont);
    this.eleCityPanelList = document.getElementById(config.eleCityPanelList);


    // 国内选项卡呈现
    this.showDom();
    this.tabSwitch(this.eleDomesticTab.firstChild.firstChild); // 国内显示第一个选项卡
    // 国际选项卡呈现
    this.showInt();
    this.tabSwitch(this.eleIntTab.firstChild.firstChild); // 国际显示第一个选项卡

    // 事件绑定
    this.eleEventListening();
  },

  // 显示城市panel
  showCityPanel: function () {
    this.eleCityPanel.style.top = this.eleTop + "px";
    this.eleCityPanel.style.left = this.eleLeft + "px";
    this.eleCityPanel.style.display = "block";
    this.hidePinYinPanel(); // 隐藏拼音查询页面
    this.showTabPanel(); // 显示城市列表
  },

  // input 动态绑定
  dynamicInputBinding: function (top, left) {
    // 绑定坐标
    this.eleTop = top;
    this.eleLeft = left;

    var _self = this;
    // 绑定内容改变事件
    if (this.inputEle.addEventListener) {
      // FF
      this.inputEle.addEventListener("input", function (e) {
        _self.searchInputValue(e);
      }, false);

    } else if (this.inputEle.attachEvent) {
      // IE
      if (!this.inputEle.onpropertychange) { // 判断是否已绑定该事件
        this.inputEle.onpropertychange = function (e) {
          _self.searchInputValue(e);
        };
      }
    }

  },

  // 拼音查询事件
  searchInputValue: function (e) {
    var srcEle = e.target || e.srcElement;
    // 查找字符
    var searchStr = srcEle.value;
    // 匹配的字符串
    //var a = city.domestic.address;

    // 判断当前搜索词是否跟上一个重复
    if (searchStr === this.searchValuePre) {
      return;
    }
    this.searchValuePre = searchStr;

    // 正则匹配
    var regExp = new RegExp("@" + searchStr + "+[^@]*", "ig");
    //console.log(a.match(regExp));
    // 显示查询内容
    this.searchPinYinStr(city.domestic.address.match(regExp));
    this.searchPinYinStr(city.international.address.match(regExp));
  },

  // 拼音查询内容拼串显示 - data 查询数组
  searchPinYinStr: function (data) {
    //判断是否为空
    if ((!data) || data.length === 0) {
      return;
    }

    //
    var i = 0, maxLength = 12, ele, arrStr = [],
      arrACity = [];
    // 拼接查询内容
    for (; ((ele = data[i]) && maxLength > 0); maxLength--, i++) {
      arrStr = ele.substr(1, ele.length - 2).split("|");
      //console.log(arrStr);
      arrACity.push('<a class="a1" href="javascript:;" title="' + arrStr[1] + '"><b>' + arrStr[0] + '</b><span>' + arrStr[1] + '</span></a>');
    }
    // 插入页面
    this.elePinYinCont.innerHTML = arrACity.join("");

    // 显示查询结果页面
    this.elePinYin.style.top = this.eleTop + "px";
    this.elePinYin.style.left = this.eleLeft + "px";
    this.elePinYin.style.display = "block";

    // 隐藏城市列表
    this.hideTabPanel();
  },

  // 拼音div隐藏
  hidePinYinPanel: function () {
    this.elePinYin.style.display = "none";
  },

  // 事件绑定
  eleEventListening: function () {

    var _self = this;

    // 关闭按钮事件绑定
    this.eleCityClose.onclick = function (e) {
      _self.hideRootPanel();
    };

    //国内国际按钮切换
    this.eleCityArea.onclick=function(e){
      var srcEle = e.target || e.srcElement;
      if (srcEle.nodeName === "A") {
        _self.areaSwitch(srcEle);
      }
    };

    // 国内选项卡事件绑定
    this.eleDomesticTab.onclick = function (e) {
      var srcEle = e.target || e.srcElement;
      if (srcEle.nodeName === "A") {
        _self.tabSwitch(srcEle);
      }
    };

    // 国际选项卡事件绑定
    this.eleIntTab.onclick = function (e) {
      var srcEle = e.target || e.srcElement;
      if (srcEle.nodeName === "A") {
        _self.tabSwitch(srcEle);
      }
    };

    // 国内城市选择绑定
    this.eleDomesticBody.onclick = function (e) {

      var srcEle = e.target || e.srcElement;

      if (srcEle.nodeName === "SPAN") {
        // 城市设置到 input 的 value
        if (_self.inputEle.nodeName == "INPUT") {
          _self.inputEle.value = srcEle.innerHTML;
        } else {
          _self.inputEle.innerHTML = srcEle.innerHTML;
        }
        _self.hideRootPanel();    //隐藏城市列表
      }
    };

    // 国际城市选择绑定
    this.eleIntBody.onclick = function (e) {

      var srcEle = e.target || e.srcElement;

      if (srcEle.nodeName === "SPAN") {
        // 城市设置到 input 的 value
        if (_self.inputEle.nodeName == "INPUT") {
          _self.inputEle.value = srcEle.innerHTML;
        } else {
          _self.inputEle.innerHTML = srcEle.innerHTML;
        }
        _self.hideRootPanel();    //隐藏城市列表
      }
    };

    // 查询列表单击事件
    this.elePinYinCont.onclick = function (e) {
      var srcEle = e.target || e.srcElement;
      if (srcEle.nodeName === "A") {
        _self.inputEle.value = srcEle.title;
      } else if (srcEle.parentNode.nodeName === "A") {
        _self.inputEle.value = srcEle.parentNode.title;
      }
      _self.hideRootPanel();    //隐藏城市列表
    };
  },

  // 选项卡切换
  tabSwitch: function (ele) {
    var parentEle = ele.parentNode.parentNode;
    var srcBodyDiv = null; // 正在呈现body div rel
    // 选型卡样式切换
    // 移除上一个选中项
    var oldChecked = parentEle.getElementsByClassName("active")[0];
    if (oldChecked) {
      oldChecked.className = "";
      srcBodyDiv = oldChecked.getAttribute("rel");
    }
    // 设置新的选中项
    ele.className = "active";

    // 显示相应的body div
    if (srcBodyDiv) {
      this.searchRel(this.eleDomesticBody.getElementsByTagName("ul"), srcBodyDiv, ele.getAttribute("rel"));
      this.searchRel(this.eleIntBody.getElementsByTagName("ul"), srcBodyDiv, ele.getAttribute("rel"));
      return;
    }
    this.searchRel(this.eleDomesticBody.getElementsByTagName("ul"), 1, ele.getAttribute("rel"));
    this.searchRel(this.eleIntBody.getElementsByTagName("ul"), 1, ele.getAttribute("rel"));
  },

  areaSwitch:function(ele){
    var parentEle = ele.parentNode.parentNode;
    var srcBodyDiv = null; // 正在呈现body div rel
    // 选型卡样式切换
    // 移除上一个选中项
    var oldChecked = parentEle.getElementsByClassName("active")[0];
    if (oldChecked) {
      oldChecked.className = "";
      srcBodyDiv = oldChecked.getAttribute("rel");
    }

    // 设置新的选中项
    ele.className = "active";

    // 显示相应的body div
    if (srcBodyDiv) {
      this.searchRel(this.eleCityPanelList.getElementsByTagName("div"), srcBodyDiv, ele.getAttribute("rel"));
      return;
    }
    this.searchRel(this.eleCityPanelList.getElementsByTagName("div"), 1, ele.getAttribute("rel"));
  },

  // rel 属性查找显示相应的div
  searchRel: function (eleLists, hideEle, showEle) {
    var i = 0, ele;
    for (; (ele = eleLists[i++]);) {
      (ele.getAttribute("rel") === hideEle) && (ele.style.display = "none");
      (ele.getAttribute("rel") === showEle) && (ele.style.display = "block");
    }
  },

  // 国内城市页面初始化呈现
  showDom: function () {

    // 国内城市页面初始化
    var hotCityList = city.domestic.city_Cate;
    var tabList = [], // 选项卡
      _bodyList = []; // 临时主体

    //创建一个文档片段存储选项卡信息
    var bodyListFrag = document.createDocumentFragment(),
      bodyListFragUl = null;

    // 选项卡
    var keys = null;
    for (keys in hotCityList) {
      // tab 列表 <li><a href="javascript:;">XYZ</a></li>
      tabList.push('<li><a href="javascript:;" rel="' + keys.substr(0, 2) + '">' + keys.substr(2) + '</a></li>');
      // 主体拼接
      bodyListFragUl = document.createElement("ul");
      bodyListFragUl.className = "hot-city";
      bodyListFragUl.setAttribute("rel", keys.substr(0, 2));

      _bodyList = hotCityList[keys].split("@");
      for (var i = 0, ele, l = _bodyList.length; i < l; i++) {
        ele = _bodyList[i];
        if (ele) { // li 设置
          var li = document.createElement("li");
          var span = document.createElement("span");
          span.title = ele.split("|")[1];
          span.innerHTML = ele.split("|")[1];
          li.appendChild(span);
          bodyListFragUl.appendChild(li);
        }
      }
      bodyListFrag.appendChild(bodyListFragUl);
    }
    // 选项卡插入
    this.eleDomesticTab.innerHTML = tabList.join("");
    // 主体部分插入
    this.eleDomesticBody.innerHTML = "";
    this.eleDomesticBody.appendChild(bodyListFrag);


  },

  // 国际城市页面初始化呈现
  showInt:function(){
    //国际城市页面初始化
    var catCityList=city.international.area_Cate; //获取分类城市列表
    var tabList=[],
      _bodyList=[];

    //创建一个文档片段存储选项卡信息
    var bodyListFrag=document.createDocumentFragment(),
      bodyListFragUl=null;

    //选项卡
    var keys=null;
    for(keys in catCityList){
      //tab列表<li><a href="javascript:;">亚洲</a></li>
      tabList.push('<li><a href="javascript:;" rel="'+keys.substr(0, 2)+'">'+keys.substr(2)+'</a></li>');
      //主体拼接
      bodyListFragUl=document.createElement("ul");
      bodyListFragUl.className="hot-city";
      bodyListFragUl.setAttribute("rel",keys.substr(0, 2));

      _bodyList=catCityList[keys].split("@");
      for (var i = 0, ele, l = _bodyList.length; i < l; i++) {
        ele = _bodyList[i];
        if (ele) { // li 设置
          var li = document.createElement("li");
          var span = document.createElement("span");
          span.title = ele.split("|")[1];
          span.innerHTML = ele.split("|")[1];
          li.appendChild(span);
          bodyListFragUl.appendChild(li);
        }
      }
      bodyListFrag.appendChild(bodyListFragUl);
    }

    // 选项卡插入
    this.eleIntTab.innerHTML = tabList.join("");
    // 主体部分插入
    this.eleIntBody.innerHTML = "";
    this.eleIntBody.appendChild(bodyListFrag);

    //隐藏
    this.eleIntBox.style.display="none";

  },

  // 隐藏选项卡页面
  hideTabPanel: function () {
    this.eleCityPanelList.style.display = "none";
  },

  // 显示选项卡页面
  showTabPanel: function () {
    this.eleCityPanelList.style.display = "block";
  },

  //隐藏

  // 关闭根panel
  hideRootPanel: function () {
    this.eleCityPanel.style.display = "none";
    city.cityOperation.showShadow("off");
  },

  // 显示根panel
  showRootPanel: function () {
    this.eleCityPanel.style.display = "block";
  },

  //获取绝对位置的横坐标
  getElementLeft: function (element) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null) {
      actualLeft += current.offsetLeft;
      current = current.offsetParent;
    }
    return actualLeft;
  },

  //获取绝对位置的纵坐标
  getElementTop: function (element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }
    return actualTop;
  },

  //显示遮罩层
  showShadow: function (opt) {
    if (opt == "on") {
      $('body').append('<div id="zshadow"></div>');
      var shadow = $('#zshadow');
      shadow.css({
        'left': 0,
        'top': 0,
        'position': 'fixed',
        'width': '100%',
        'height': '100%',
        'background': '#000',
        'opacity': 0,
        'z-index': 99
      })
        .bind('click', function () {
          shadow.remove();
          city.cityOperation.hideRootPanel();
        });
    } else if (opt == "off") {
      $('#zshadow').remove();
    }
  }

};

//初始化
$(function () {
  city.cityOperation.init();

  var cityList = $('.getcity');
//显示城市列表
  cityList.bind("focus", function () {
    var that = this;
    var top = city.cityOperation.getElementTop(that);
    var left = city.cityOperation.getElementLeft(that);
    var height = $(that).height();

    // 绑定input
    city.cityOperation.inputEle = this;
    city.cityOperation.dynamicInputBinding(top + height + 3, left);
    city.cityOperation.showCityPanel();
    city.cityOperation.showShadow('on');
  });
});

