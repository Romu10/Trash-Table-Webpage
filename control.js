// give each class an ID 
let vueApp = new Vue({
    el: "#robotState",
    data: {
        // stating page variables
        robot_state: 'Ready',
        logsinfo: 'Hola',
        informations: 'Informations',
        connected: false,
        // ros connection
        ros: null,
        rosbridge_address: 'wss://i-0123456789.robotigniteacademy.com/rosbridge/', // change to your own address
        // dragging data
        dragging: false,
        x: 'no',
        y: 'no',
        dragCircleStyle: {
            margin: '0px',
            top: '0px',
            left: '0px',
            display: 'none',
            width: '55px',
            height: '55px',
        },
        joystickcont:{
            display: 'flex',
        },
        stopButton:{
            display: 'none',
        }, 
        imgstopped:{
            display: 'flex',
        }, 
        imgloading:{
            display: 'none',
        }, 
        imgcomplete: {
            display: 'none',
        },
        progressNumber: {
        },
        progressNumberh3: {
        },
        progressNumberh4: {
        },
        progressNumberMoveTable: {
        },
        progressNumberMoveTableh3: {
        },
        progressNumberMoveTableh4: {
        },
        progressNumberReady: {
        },
        progressNumberReadyh3: {
        },
        progressNumberReadyh4: {
        },
        imgmanual: {
            display: 'none',
        },
        joystickclass: {
            display: 'flex',
        },
        // joystick valules
        joystick: {
            vertical: 0,
            horizontal: 0,
        },
        logsCont: {
            display: 'none',
        }
    },
    methods: {
        connect: function() {
            // define ROSBridge connection object
            this.ros = new ROSLIB.Ros({
                url: this.rosbridge_address
            })

            // define connection callback
            this.ros.on('connection', () => {
                this.connected = true
                console.log('Connection to ROSBridge established!')
            })
            // define error callback
            this.ros.on('error', (error) => {
                console.log('Something went wrong when trying to connect')
                console.log(error)
            })
            // define close callback
            this.ros.on('close', () => {
                this.connected = false
                console.log('Connection to ROSBridge was closed!')
            })
        },
        disconnect: function() {
            this.ros.close()
        },
        sendCommand: function() {
            let topic = new ROSLIB.Topic({
                ros: this.ros,
                name: '/cmd_vel',
                messageType: 'geometry_msgs/Twist'
            })
            let message = new ROSLIB.Message({
                linear: { x: 1, y: 0, z: 0, },
                angular: { x: 0, y: 0, z: 0.5, },
            })
            topic.publish(message)
        },
        startDrag() {
            console.log('Dragging started')
            this.dragging = true
            this.x = this.y = 0
        },
        stopDrag() {
            console.log('Dragging stopped')
            this.dragging = false
            this.x = this.y = 'no'
            this.dragCircleStyle.display = 'none'
            this.resetJoystickVals()
        },
        doDrag(event) {
            if (this.dragging) {
                this.x = event.offsetX
                this.y = event.offsetY
                let ref = document.getElementById('dragstartzone')
                this.dragCircleStyle.display = 'inline-block'

                let minTop = ref.offsetTop - parseInt(this.dragCircleStyle.height) / 2
                let maxTop = minTop + 150
                let top = this.y + minTop
                this.dragCircleStyle.top = `${top}px`

                let minLeft = ref.offsetLeft - parseInt(this.dragCircleStyle.width) / 2
                let maxLeft = minLeft + 150
                let left = this.x + minLeft
                this.dragCircleStyle.left = `${left}px`

                this.setJoystickVals()
                console.log('Dragging!')
                console.log(this.x)
                this.logsinfo = this.logsinfo + this.x.toString()
            }
        },
        setJoystickVals() {
            this.joystick.vertical = -1 * ((this.y / 150) - 0.5)
            this.joystick.horizontal = +1 * ((this.x / 150) - 0.5)
        },
        resetJoystickVals() {
            this.joystick.vertical = 0
            this.joystick.horizontal = 0
        },

        changeContentOperating() {
            console.log('Content changed to operating')
            this.stopButton.display = 'none'
            this.informations = 'Operating'
            this.joystickcont.display = 'flex'
            this.logsCont.display = 'none'
            this.logsinfo = this.joystick.vertical
            this.stateChangeManual()
        },

        changeContentJoystick() {
            console.log('Content changed to operating')
            this.stopButton.display = 'flex'
            this.informations = 'Working'
            this.joystickcont.display = 'none'
            this.logsCont.display = 'flex'
            this.logsinfo = this.joystick.vertical
            this.stateChangeLoading()
            this.searchingForTable()
            // Espera 5 segundos antes de llamar a stateChangeDone()
            setTimeout(() => {
                this.movingTable();
                this.tableReady();
                this.stateChangeDone();
            }, 5000);
        },

        changeContentStopped() {
            console.log('Content changed to operating')
            this.stopButton.display = 'flex'
            this.informations = 'Working'
            this.joystickcont.display = 'none'
            this.logsCont.display = 'flex'
            this.logsinfo = this.joystick.vertical
            this.stateChangeStopped()
        },

        changeContentDone() {
            console.log('Content changed to operating');
            this.stopButton.display = 'flex';
            this.informations = 'Working';
            this.joystickcont.display = 'none';
            this.logsCont.display = 'flex';
            this.logsinfo = this.joystick.vertical;
            this.stateChangeDone();
        },        
        
        stateChangeStopped(){
            this.imgstopped.display = 'flex'
            this.imgloading.display = 'none'
            this.imgcomplete.display = 'none'
            this.imgmanual.display = 'none'
        },

        stateChangeLoading() {
            this.imgstopped.display = 'none'
            this.imgloading.display = 'flex'
            this.imgcomplete.display = 'none'
            this.imgmanual.display = 'none'
        },
        
        stateChangeDone() {
            this.imgstopped.display = 'none'
            this.imgloading.display = 'none'
            this.imgcomplete.display = 'flex'
            this.imgmanual.display = 'none'
        },

        stateChangeManual() {
            this.imgstopped.display = 'none'
            this.imgloading.display = 'none'
            this.imgcomplete.display = 'none'
            this.imgmanual.display = 'flex'
        },

        searchingForTable() {
            this.progressNumber.backgroundColor = "#151E2B"
            this.progressNumberh3.color = "#C5CFDD"
            this.progressNumberh4.color = "#151E2B"
        },
        movingTable() {
            this.progressNumberMoveTable.backgroundColor = "#151E2B"
            this.progressNumberMoveTableh3.color = "#C5CFDD"
            this.progressNumberMoveTableh4.color = "#151E2B"
        },
        tableReady() {
            this.progressNumberReady.backgroundColor = "#151E2B"
            this.progressNumberReadyh3.color = "#C5CFDD"
            this.progressNumberReadyh4.color = "#151E2B"
        },
    },
    mounted() {
        // page is ready
        console.log('Control page is ready!')
        window.addEventListener('mouseup', this.stopDrag)
    },
})