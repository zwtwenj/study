class EventBus{
    constructor(){
        this.eventMap = new Map()
    }
    on (string, cb) {
        let cbs = this.eventMap.get(string)
        if (!cbs) {
            cbs = [{func: cb, once: false}]
            this.eventMap.set(string, cbs)
        } else {
            cbs.push({funct: cb, once: false})
        }
        console.log(this.eventMap)
    }
    emit (string, data) {
        let cbs = this.eventMap.get(string)
        if (cbs) {
            for (let i = 0; i < cbs.length; i ++) {
                let cb = cbs[i]
                if (cb) {
                    cb.func(data)
                    if (cb.once) {
                        cbs[i] = undefined
                    }
                }
            }
        }
    }
    off (string) {
        this.eventMap.delete(string)
    }
    once (string, cb) {
        let cbs = this.eventMap.get(string)
        if (!cbs) {
            cbs = [{func: cb, once: true}]
            this.eventMap.set(string, cbs)
        } else {
            cbs.push({func: cb, once: true})
        }
    }
}

const a = new EventBus()

a.on('start', function (data) {
    console.log(data)
})
a.emit('start', '1111')
a.off('start')
a.emit('start', '111122')
a.once('once', function (data) {
    console.log(data)
})
a.emit('once', '2222')
a.emit('once', '3333')