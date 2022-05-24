import { useEffect, useState } from "react";
import toast from "react-hot-toast";

let bluetoothDevice, sendCharacteristic, receiveCharacteristic;
export default function BLE({
  connect = false,
  disconnect = false,
  primaryServiceUuid = parseInt(0xFFE0),
  sendCharUuid = parseInt(0xFFE1),
  receiveCharUuid = parseInt(0xFFE2),
  command,
  vendorId,
  onSuccessReceived,
}) {
  const [support, setSupport] = useState(false);
  const [connected, setConnected] = useState(false);
  const [sent, setSent] = useState(false);
  const [received, setReceived] = useState(false);

  // support check
  useEffect(() => {
    navigator.bluetooth.getAvailability().then((available) => {
      if (available) {
        setSupport(true);
      } else {
        setSupport(false);
      }
    });
  }, []);

  // listen
  const listen = async () => {
    if (receiveCharacteristic) {
      receiveCharacteristic
        .addEventListener('characteristicvaluechanged',
          (evt) => {
            const value = evt.target.value;
            console.log(value, evt.target);

            if (parseInt(value) === 10) {
              setReceived(true);
              // receiveCharacteristic
              //   .removeEventListener('characteristicvaluechanged')
              onSuccessReceived();
            }
            else {
              toast.error("Failed operation, Plz contact with service provider");
            }
          });
      receiveCharacteristic.startNotifications();
    }
  };
  // send command
  const handleSend = async () => {
    if (!bluetoothDevice) {
      return toast.error("No device connected");
    }
    if (sendCharacteristic) {
      sendCharacteristic.writeValue(new TextEncoder().encode(command));
      setSent(true);
    } else {
      return toast.error("Whoops, sorry, sendCharacteristic is invalid");
    }
  };
  const handleDisconnect = () => {
    console.log("disconnect");
    if (!bluetoothDevice) {
      console.log("No device");
      return; 
      //return toast.error("No Device");
    }
    if (bluetoothDevice.gatt.connected) {
      bluetoothDevice.gatt.disconnect();
    }
    bluetoothDevice = null;
    receiveCharacteristic = null;
    sendCharacteristic = null;
    setConnected(false);
    setReceived(false);
    setSent(false);
  };
  // connect effect
  useEffect(() => {
    const handleConnect = async () => {
      if (!support) {
        return toast.error("No Bluetooth Device support");
      }
      if (connect && support) {
        bluetoothDevice = null;
        bluetoothDevice = await navigator.bluetooth.requestDevice({
          // acceptAllDevices: true,
          // nameprefix:[]
          // optionalServices: [primaryServiceUuid]
          filters: [{ services: [primaryServiceUuid] }],
        });
        if (bluetoothDevice != null && bluetoothDevice) {
          const server = await bluetoothDevice.gatt.connect();
          if (!server) {
            return toast.error("Whoops, failed. Retry: server not found");
          }
          const service = await server.getPrimaryService(primaryServiceUuid);
          if (!service) {
            return toast.error("Whoops, failed. Retry: service not found");
          }
          sendCharacteristic = await service.getCharacteristic(sendCharUuid);
          if (!sendCharacteristic) {
            return toast.error(
              "Whoops, failed. Retry: Send characteristic not found."
            );
          }
          // receiveCharacteristic = sendCharacteristic;
          receiveCharacteristic = await service.getCharacteristic(receiveCharUuid);
          if (!receiveCharacteristic) {
            return toast.error('Whoops, failed. Retry: Receive characteristic not found.');
          }
          setConnected(true);
          handleSend();
          listen();
        }
      }
    };
    if(connect) handleConnect();
    if (disconnect) {
      handleDisconnect();
    }
    // return ()=>{disconnect()};
  }, [connect, primaryServiceUuid, sendCharUuid, support, disconnect]);

  return (
    <div className="w-full grid grid-cols-2 gap-2">
      <div className="flex gap-1">
        <button
          className={`btn-circle btn-xs ${support ? "btn-info" : "btn-error"}`}
        />
        <label>Support BLE</label>
      </div>{" "}
      <div className="flex gap-1">
        <button
          className={`btn-circle btn-xs ${connected ? "btn-info" : "btn-error"
            }`}
        />
        <label> {vendorId}</label>
      </div>{" "}
      <div className="flex gap-1 border-t pt-1">
        <button
          className={`btn-circle btn-xs ${sent ? "btn-info" : "btn-error"}`}
        />
        <label>Sent</label>
      </div>{" "}
      <div className="flex gap-1 border-t pt-1">
        <button
          className={`btn-circle btn-xs ${received ? "btn-info" : "btn-error"}`}
        />
        <label>Received</label>
      </div>{" "}
    </div>
  );
}
