/* Services */


var serviceModule;

// Demonstrate how to register services
// In this case it is a simple value service.
(function(window,angular,undefined){
  /**
    * how to create a service?
      1.value method
      2.provider method
      3.factory method
      4.service method
    */

//        var options = {debug:true, forkLocal:true};
//        var bus = new window.good.channel.WebSocketBus("http://test.goodow.com:8080/eventbus", options);
//      var RealtimeService = function(){
//
//      };
//    RealtimeService.prototype = {
//      bindOnOpenHandler : function(onOpenHandler) {
//      bus.registerHandler("@goodow.bus.onOpen", onOpenHandler);
//      return this;
//      },
//    bindOnCloseHandler : function(onCloseHandler) {
//      bus.registerHandler("@goodow.bus.onClose", onCloseHandler);
//      return this;
//      },
//    bindOnErrorHandler : function(onErrorHandler) {
//      bus.registerHandler("@goodow.bus.onError", onErrorHandler);
//      return this;
//      },
//    bindOnMessageHandler : function(channel,onMessageHandler) {
//      var self_ = this;
//      var handlerRegistration = bus.registerHandler(channel, onMessageHandler);
//      return this;
//      },
//      publish : function(channel,obj) {
//      var self_ = this;
//     bus.publish(channel,obj);
//     return this;
//      },
//      close:function(){
//        if (bus) {
//        bus.close();
//      }
//      }
//      // ,send:function(channel,obj,callback){
//      //   var message = bus.send(channel,obj,callback);
//      //   message.reply(obj);
//      // }
//    }

  serviceModule = angular.module('goodow.ui.services', [])
  .factory('goodowConstant', function(){
    return {
      SVG_SID:'someaddress.s',
      SERVER:'http://test.goodow.com:8080/eventbus'
    }
  })
  .factory('realtimeService',['goodowConstant',function(goodowConstant){
          var options = {debug:true, forkLocal:true};
          return function(){
              var bus = new window.good.channel.WebSocketBus(goodowConstant.SERVER, options);
              return bus;
          }
      }])
  .factory('goodowUtil', function(){
          function transform(element,value){
              element.style('-webkit-transform',value)
                  .style('-moz-transform',value)
                  .style('-o-transform',value)
                  .style('transform',value);
          }
          return {
              'transform':transform
          };
      })
  .factory('graphService', ['goodowUtil',function(goodowUtil){
          var linefn = d3.svg.line()
                .x(function(d){return d[0];})
                .y(function(d){return d[1];})
                .interpolate('linear');
          var svgHeight = null;
          var svgWidth = null;
          var rectGenerator = function(config,svgElement){
              //Really needed?
              if(config.type !== 'rect')
                  return;
//              var linear_scale_y = d3.scale.linear().range([0,svgHeight]).domain([0,config.y]);
//              var linear_scale_x = d3.scale.linear().range([0,svgWidth]).domain([0,config.x]);
              var rect = svgElement.append('g').append('rect');
              rect.attr('fill',config.fill)
                  .attr('stroke',config.stroke)
                  .attr('stroke-width',config['stroke-width'])
                  .attr('stroke-linecap',"round");
//              rect.attr('x',linear_scale_x(config.x))
//                  .attr('y',linear_scale_y(config.y))
              rect.attr('x',config.x)
                  .attr('y',config.y)
                  .attr('width',config.width)
                  .attr('height',config.height);
              if (config.transform) {
                  goodowUtil.transform(rect,'rotate(' + config.transform.rotate + 'deg)');
              }

          };

          var ellipseGenerator = function(config,svgElement) {
              var ellipse = svgElement.append('g').append('ellipse');
              ellipse.attr('fill', config.fill)
                  .attr('stroke', config.stroke)
                  .attr('stroke-width', config['stroke-width'])
                  .attr('stroke-linecap', "round");
              ellipse.attr('cx', config.cx)
                      .attr('cy', config.cy)
                      .attr('rx', config.rx)
                      .attr('ry', config.ry);
                  if (config.transform) {
//                      ellipse.style('-webkit-transform', 'rotate(' + config.transform.rotate + 'deg)')
//                          .style('-moz-transform', 'rotate(' + config.transform.rotate + 'deg)')
//                          .style('-o-transform', 'rotate(' + config.transform.rotate + 'deg)')
//                          .style('transform', 'rotate(' + config.transform.rotate + 'deg)');
                      goodowUtil.transform(ellipse,'rotate(' + config.transform.rotate + 'deg)');
                  }
          }

          var pathGenerator = function(config,svgElement){
              var path  = svgElement.append('g').append('path');
              path.attr('stroke',config.stroke)
                  .attr('stroke-width',config['stroke-width'])
                  .attr('fill','none')
                  .attr('stroke-linecap',"round");
              if(angular.isArray(config.d)&&config.d.length >= 2){
                  path.attr('d',linefn(config.d));
              }
              if (config.transform) {
                  goodowUtil.transform(path,'rotate(' + config.transform.rotate + 'deg)');
              }
          }
    var factoryMap = {
        'ellipse':ellipseGenerator,
        'path':pathGenerator,
        'rect':rectGenerator
        //...
    }



    //CanvasElement
    return {
        //通过数据画出图形
        drawGraph : function(config){
            var fn = factoryMap[config.type];
            var svgElement = d3.select('#mysvg');
            svgHeight = svgElement.property('height').animVal.value;
            svgWidth = svgElement.property('width').animVal.value;

            if(angular.isFunction(fn)){
                fn.call(null,config,svgElement);
            }else{
                throw new Error(fn +' is not a function');
            }
        }
        //d3 api  line gengerator 统一由service提供
        ,lineFunction : function(name){
            return linefn;
        }
    }

  }]);
//  serviceModule.provider('testService',function(){
//     var data = 12;
//     this.$get = function(){
//       return {
//         say:function(data){
//             if(this.data){
//               alert(this.data);
//          }else{
//           alert(data);
//          }
//         }
//       }
//     };
//     this.setData = function(data){
//       data = data;
//     }
//  });
//  serviceModule.config(['testServiceProvider',function(testServiceProvider) {
//      testServiceProvider.setData('hello world');
//  }]);
})(window,angular);
