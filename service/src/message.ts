import {Client} from 'azure-iothub'
import {connectionString} from './registry'
import {EventHubClient, EventPosition} from '@azure/event-hubs'


export async function startListening(){
    let client = Client.fromConnectionString(connectionString);
    client.addListener
    let receiver = await client.getFeedbackReceiver();
    console.log(receiver.message);
    receiver.result.on('1', (msg)=>{
        console.log(msg.data)
    })
}

function printError (err) {
    console.log(err.message);
};

function printMessage(message){
    console.log(JSON.stringify(message.body));
    console.log('Application properties (set by device): ')
    console.log(JSON.stringify(message.applicationProperties));
}

export async function listenToMessages(){
    console.log(connectionString);
    let eventClient = await EventHubClient.createFromIotHubConnectionString(connectionString);

    let ids = await eventClient.getPartitionIds();

    ids.map((id)=>{
        return eventClient.receive(id, printMessage, printError, { eventPosition: EventPosition.fromEnqueuedTime(Date.now()) });
    })
}

(async ()=>{
    await listenToMessages();
})()
