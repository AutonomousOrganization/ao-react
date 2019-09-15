import uuidV1 from 'uuid/v1'
import dctrlDb from '../dctrlDb'

function aoConnected(address, secret, callback) {
    let newEvent = {
        type: "ao-connected",
        address,
        secret,
    }
    dctrlDb.insertEvent(newEvent, callback)
}

function aoDisconnected(aoId, callback) {
    let newEvent = {
        type: "ao-disconnected",
        aoId,
    }
    dctrlDb.insertEvent(newEvent, callback)
}

export default {
    aoConnected,
    aoDisconnected
}