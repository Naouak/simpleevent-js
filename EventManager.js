var EventManager = function(){
    var eventsHandler = {};
    var defaultHandler = {};
    var afterHandler = {};

    this.setDefault = function(eventName, func){
        defaultHandler[eventName] = func;
    };

    // When func returns a falsy value, event will be considered as canceled. Only on functions will be called.
    // Please note that on is only for event validation !
    // You should do reaction only with after command
    this.on = function(eventName, func){
        if(eventsHandler[eventName] === undefined){
            eventsHandler[eventName] = [];
        }
        eventsHandler[eventName].push(func);
        //For chaining, we return this;
        return this;
    };

    // This is basically the same as On but it won't block the actual event.
    // If you don't need to change something in the event, you SHOULD use this function.
    // Note that after handlers are runned with setImmediate (or setTimeout if not available).
    // If you need less than 4ms lag in most browser, you can use this polyfill :
    // https://github.com/NobleJS/setImmediate/blob/master/setImmediate.js
    this.after = function(eventName, func){
        if(afterHandler[eventName] === undefined){
            afterHandler[eventName] = [];
        }
        afterHandler[eventName].push(func);
        //For chaining, we return this;
        return this;
    };

    // Fire a custom event.
    this.fire = function(eventName,args){
        var onEvents = eventsHandler[eventName],
            defaultHandler = defaultHandler[eventName],
            afterEvents = afterHandler[eventName],
            canceled = false,
            i;
        if(onEvents){
            for(i = 0; i < onEvents.length; i++){
                if(!onEvents[i](arguments)){
                    canceled = true;
                }
            }
            if(canceled){
                return false;
            }
        }

        defaultHandler && defaultHandler(args);

        if(afterEvents){
            var runner = setImmediate||function(func){
                setTimeout(func,0);
            };

            for(i = 0; i < afterEvents.length; i++){
                (function(i){
                    runner(function(){
                        afterEvents[i](args);
                    });
                })(i);
            }
        }
    }

};