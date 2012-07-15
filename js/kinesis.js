var InteractionEventTypes = {
    'InteractionEventTypeGesture': 0,
    'InteractionEventTypeSpeech': 1,
    'InteractionEventTypeCursor': 2
};
var GestureTypes = {
    'GestureTypeSwipe': 0,
    'GestureTypeBody': 1,
    'GestureTypeHold': 2,
    'GestureTypeJointIntersection': 3,
    'GestureTypeSpeech': 4
};
var GestureDirections = {
    'GestureDirectionLeft': 0,
    'GestureDirectionRight': 1,
    'GestureDirectionUp': 2,
    'GestureDirectionDown': 3,
    'GestureDirectionFront': 4
};
var JointTypes = {
    'JointTypeHandRight': 0,
    'JointTypeWristRight': 1,
    'JointTypeElbowRight': 2,
    'JointTypeShoulderRight': 3,
    'JointTypeShoulderCenter': 4,
    'JointTypeShoulderLeft': 5,
    'JointTypeElbowLeft': 6,
    'JointTypeWristLeft': 7,
    'JointTypeHandLeft': 8,
    'JointTypeHead': 9,
    'JointTypeSpine': 10,
    'JointTypeHipCenter': 11,
    'JointTypeFootRight': 12,
    'JointTypeAnkelRight': 13,
    'JointTypeKneeRight': 14,
    'JointTypeFootRight': 15,
    'JointTypeHipRight': 16,
    'JointTypeHipLeft': 17,
    'JointTypeKneeLeft': 18,
    'JointTypeAnkleLeft': 19,
    'JointTypeFootLeft': 20
};
var KinesisMessages = {
    'ServerNotConnected': "Oops! some issue occured. Please make sure that the kinesis sdk is installed. <a href='http://kinesis.io' style='color: #d41f1f;' target='_blank'>Download it here.</a>",
    'ServerConnected': 'Kinesis running fine.',
    'KinectNotConnected': 'Please make sure that the Microsoft Kinect Sensor is connected and turned on.',
    'KinectConnected': 'Kinect connected.'
};
addMessageBar = function () {
    var msgNode = document.createElement("div");
    msgNode.setAttribute('id', 'kmessage');
    msgNode.setAttribute('class', 'message');
    document.body.appendChild(msgNode);
    msgNode.style.display = "none"
};
updateMessageBar = function (msg, isDisplayed) {
    var messageBar = document.getElementById('kmessage');
    if (isDisplayed) {
        messageBar.innerHTML = msg;
        var closeNode = document.createElement('span');
        closeNode.innerHTML = "close";
        closeNode.setAttribute('onclick', "document.body.removeChild(document.getElementById('kmessage'));");
        closeNode.setAttribute('class', 'closeBtn');
        messageBar.appendChild(closeNode);
        messageBar.style.display = "block"
    } else messageBar.style.display = "none"
};
Function.prototype.inheritsFrom = function (parentClassOrObject) {
    if (parentClassOrObject.constructor == Function) {
        this.prototype = new parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject.prototype
    } else {
        this.prototype = parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject
    }
    return this
};

function GestureListener() {
    GestureListener.mouseMove = function (position) {
        if (Kinesis.cursor != null) Kinesis.cursor(position);
        var x = position.x + 45;
        var y = position.y + 45;
        Kinesis.pointer.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';
        Kinesis.pointer.style.MozTransform = 'translate(' + x + 'px, ' + y + 'px)';
        var _element = document.elementFromPoint(position.x, position.y);
        if (_element.className.search('interactive') != -1) {  
            var _currentElement = _element;
            if ((Kinesis.lastElement.length == 0) || (Kinesis.lastElement[0] != _currentElement)) {
                if (Kinesis.lastElement.length != 0) {
                    Kinesis.lastElement[0].className = Kinesis.lastElement[0].className.replace(/(?:^|\s)active(?!\S)/, '');
                    Kinesis.pointer.deactivateCursorTimer()
                }
                if (_currentElement.className.search('active') == -1) _currentElement.className += " active";
                activateCursorTimer(Kinesis.pointer);
                Kinesis.lastElement.push(_currentElement);
                if (Kinesis.clickEventTimer) {
                    clearTimeout(Kinesis.clickEventTimer)
                };
                Kinesis.clickEventTimer = setTimeout(function () {
                    _currentElement.className = _currentElement.className.replace(/(?:^|\s)active(?!\S)/, '');
                    deactivateCursorTimer(Kinesis.pointer);//console.log(_currentElement);
                    try {
                        _currentElement.click();
                  } catch (e) {
                        var event = document.createEvent("MouseEvents");
                        event.initMouseEvent("click", false, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        var _r = !_currentElement.dispatchEvent(event);//console.log(_currentElement);
                    }
                    setTimeout(function () {
                        Kinesis.lastElement.pop(_currentElement)
                    }, Kinesis.holdEventDelay)
                }, 2000)
            }
        } else {
            if (Kinesis.clickEventTimer) {
                Kinesis.lastElement.pop(_currentElement);
                clearTimeout(Kinesis.clickEventTimer);
                deactivateCursorTimer(Kinesis.pointer)
            }
        }
    }
};

function SwipeGestureListener() {
    SwipeGestureListener.prototype.gestureType = GestureTypes.GestureTypeSwipe, SwipeGestureListener.prototype.joints = [JointTypes.JointTypeHandRight, JointTypes.JointTypeHandLeft], SwipeGestureListener.prototype.directions = [GestureDirections.GestureDirectionLeft, GestureDirections.GestureDirectionRight, GestureDirections.GestureDirectionUp, GestureDirections.GestureDirectionDown];
    SwipeGestureListener.prototype.eventDelay = 500;
    SwipeGestureListener.prototype.accuracy = null;
    SwipeGestureListener.prototype.bounds = {
        min: null,
        max: null
    };
    SwipeGestureListener.prototype.toFire = null
};
SwipeGestureListener.inheritsFrom(GestureListener);

function HoldGestureListener() {
    HoldGestureListener.prototype.gestureType = GestureTypes.GestureTypeHold, HoldGestureListener.prototype.joints = [JointTypes.JointTypeHandRight, JointTypes.JointTypeHandLeft], HoldGestureListener.prototype.directions = [GestureDirections.GestureDirectionLeft, GestureDirections.GestureDirectionRight, GestureDirections.GestureDirectionUp, GestureDirections.GestureDirectionDown];
    HoldGestureListener.prototype.eventDelay = 500;
    HoldGestureListener.prototype.accuracy = null;
    HoldGestureListener.prototype.bounds = {
        min: null,
        max: null
    };
    HoldGestureListener.prototype.toFire = null;
    HoldGestureListener.prototype.selector = null
};
HoldGestureListener.inheritsFrom(GestureListener);

function Kinesis() {
    Kinesis.kinectStatus = false;
    Kinesis.gestureDetection = true;
    Kinesis.pollInterval = 2000;
    Kinesis.gestures = [];
    Kinesis.cursor = null;
    Kinesis.lastElement = [];
    Kinesis.holdEventDelay = 4000;
    Kinesis.clickEventTimer = null;
    Kinesis.debug = false;
    Kinesis.prototype.keyword = "KINESIS WINDOW ONE";
    Kinesis.prototype.is_series = false;
    Kinesis.prototype.is_parallel = true;
    Kinesis.prototype.streamCounter = 0;
    Kinesis.prototype.canvas = "#kinesis";
    Kinesis.pointer = null;
    this.initialize = function (data) {
        if (Kinesis.gestureDetection == true && data) this.matchGestures(data)
    };
    Kinesis.onStatusChange = function (message) {
        console.info(message)
    };
    Kinesis.updateDepthImage = function (depthImage) {
        var depthImage = document.getElementById('depthImage');
        depthImage.src = "data:image/png;base64," + depthImage
    };
    Kinesis.prototype.addGesture = function (gesture) {
        Kinesis.gestures.push(gesture)
    };
    Kinesis.prototype.setStream = function () {};
    Kinesis.prototype.resetStream = function () {};
    Kinesis.prototype.matchGestures = function (data) {
        if (data.gestures[0] != undefined) {
            eventType = data.gestures[0].type;
            joints = data.gestures[0].joints;
            direction = [data.gestures[0].direction];
            accuracy = data.gestures[0].accuracy;
            if (data.gestures[0].origin != undefined) {
                origin = {};
                origin.x = data.gestures[0].origin.x;
                origin.y = data.gestures[0].origin.y;
                origin.z = data.gestures[0].origin.z
            }
        }
        if (data.cursor != undefined) {
            positionX = data.cursor.x;
            positionY = data.cursor.y;
            positionZ = data.cursor.z
        }
        for (index in Kinesis.gestures) {
            gesture = Kinesis.gestures[index];
            if (checkBounds(origin, gesture.bounds)) {
                if (gesture.gestureType == eventType) {
                    log("Gesture Detected");
                    if ((joints.intersect(gesture.joints)).length > 0) {
                        log("Allowed Joint Detected");
                        if ((direction.intersect(gesture.directions)).length > 0) {
                            log("Allowed Direction Detected");
                            gesture.toFire(gesture);
                            break
                        } else {
                            log("Direction did not match");
                            continue
                        }
                    } else {
                        log("Joint did not match");
                        continue
                    }
                } else {
                    log("Gesture not found");
                    continue
                }
            } else {
                continue
            }
        }
        setKinesisTimer()
    }
}function checkBounds(origin, bounds) {
    var matched = true;
    if ((bounds.min == null && bounds.max == null)) log("No bounds specified for gesture");
    else {
        if (bounds.min == null || (bounds.min.x <= origin.x && bounds.min.y <= origin.y && bounds.min.z <= origin.z)) log("Minimum bounds satisfied");
        else {
            log("Minimum bounds not satisfied");
            matched = false
        }
        if (bounds.max == null || (bounds.max.x >= origin.x && bounds.max.y >= origin.y && bounds.max.z >= origin.z)) log("Max bounds satisfied");
        else {
            log("Max bounds not satisfied");
            matched = false
        }
    }
    return matched
};

function setKinesisTimer() {
    log("Gesture Listener Timeout");
    Kinesis.gestureDetection = false;
    setTimeout("resetKinesisTimer()", Kinesis.pollInterval)
};

function resetKinesisTimer() {
    log("Gesture Listener Timer Started");
    Kinesis.gestureDetection = true
};
Array.prototype.intersect = function () {
    if (!arguments.length) return [];
    var a1 = this;
    var a = a2 = null;
    var n = 0;
    while (n < arguments.length) {
        a = [];
        a2 = arguments[n];
        var l = a1.length;
        var l2 = a2.length;
        for (var i = 0; i < l; i++) {
            for (var j = 0; j < l2; j++) {
                if (a1[i] === a2[j]) a.push(a1[i])
            }
        }
        a1 = a;
        n++
    }
    return a.unique()
};
Array.prototype.unique = function () {
    var a = [];
    var l = this.length;
    for (var i = 0; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
            if (this[i] === this[j]) j = ++i
        }
        a.push(this[i])
    }
    return a
};
var cursorTimer = null;

function activateCursorTimer(me) {
    var canvas = me;
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = 30;
    var startingAngle = -0.5 * Math.PI;
    var incrementAngle = startingAngle;
    var endingAngle = 1.5 * Math.PI;
    var counterclockwise = false;
    var context = canvas.getContext("2d");
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 3;
    context.shadowBlur = 8;
    context.shadowColor = 'rgba(0, 0, 0, 0.5)';
    if (cursorTimer) {
        clearInterval(cursorTimer)
    }
    cursorTimer = setInterval(function () {
        context.clearRect(0, 0, 100, 100);
        if (incrementAngle > endingAngle) {
            incrementAngle = startingAngle
        } else {
            incrementAngle = incrementAngle + (0.05 * Math.PI)
        }
        context.beginPath();
        context.arc(centerX, centerY, radius, startingAngle, incrementAngle, counterclockwise);
        context.lineWidth = 8;
        context.strokeStyle = 'E5F3F9';
        context.stroke();
        context.closePath()
    }, 50);
    return me
}function deactivateCursorTimer(me) {
    if (cursorTimer) {
        clearInterval(cursorTimer)
    }
    var canvas = me;
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, 100, 100);
    return me
}function Layout() {
    Layout.pageSize = {
        width: window.innerWidth,
        height: window.innerHeight
    }
};

function insertCursor() {
    var _cursor = document.createElement('canvas');
    _cursor.id = 'cursor';
    _cursor.width = '100';
    _cursor.height = '100';
    var hand = document.createElement('div');
    hand.id = 'hand';
    _cursor.appendChild(hand);
    document.body.appendChild(_cursor);
    Kinesis.pointer = document.getElementById('cursor')
};

function insertDepthImage() {
    var _depthImage = document.createElement('img');
    _depthImage.id = 'depthImage';
    _depthImage.width = '64';
    _depthImage.height = '48';
    document.body.appendChild(_depthImage)
};
var originalInit = window.onload;

function init() {
    setTimeout(function () {
        insertCursor();
        myLayout = new Layout();
        kinect = Kinect();
        Kinect.prototype.init();
        if (originalInit) originalInit()
    }, 10)
};

function log(obj) {
    if (Kinesis.debug) console.info(obj)
}
var Kinect = function () {
        retryCount = 0;
        addMessageBar();
        connectionOpened = false;
        Kinect.onConnectionError = function () {
            updateMessageBar(KinesisMessages.ServerNotConnected, true)
        };
        Kinect.onConnectionSuccess = function () {
            updateMessageBar(KinesisMessages.ServerConnected, false);
            updateMessageBar(KinesisMessages.KinectNotConnected, true)
        };
        Kinect.prototype.init = function () {
            var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);
            if (support == null) {
                log("Your browser cannot support WebSockets!");
                return
            }
            var ws = new window[support]('ws://127.0.0.1:2011/');
            ws.onmessage = function (evt) {
                try {
                    var _data = JSON.parse(evt.data);
                    if (_data.Kinect != undefined) {
                        if (_data.Kinect == "Connected") {
                            updateMessageBar(KinesisMessages.KinectConnected, false);
                            Kinesis.kinectStatus = true
                        } else {
                            updateMessageBar(KinesisMessages.KinectNotConnected, true);
                            Kinesis.kinectStatus = false
                        }
                        Kinesis.onStatusChange(_data.Kinect)
                    };
                    if (_data.cursor != undefined) {
                        GestureListener.mouseMove({
                            x: Layout.pageSize.width * _data.cursor.x / 100,
                            y: Layout.pageSize.height * _data.cursor.y * 1.5 / 100,
                            z: _data.cursor.z
                        })
                    }
                    kinesis.initialize(_data)
                } catch (error) {}
            };
            ws.onopen = function () {
                retryCount = 0;
                connectionOpened = true;
                Kinect.onConnectionSuccess();
                log("Connection Opened")
            };
            ws.onclose = function () {
                if (connectionOpened) {
                    connectionOpened = false;
                    Kinect.onConnectionError()
                } else log("Connection Closed");
                retryOpeningWebSocket()
            };
            window.onbeforeunload = function () {
                ws.close()
            }
        };
        var retryOpeningWebSocket = function () {
                retryCount++;
                if (retryCount < 10) Kinect.prototype.init();
                else {
                    if (retryCount == 10) updateMessageBar(KinesisMessages.ServerNotConnected, true)
                }
            }
    };
window.onload = init;