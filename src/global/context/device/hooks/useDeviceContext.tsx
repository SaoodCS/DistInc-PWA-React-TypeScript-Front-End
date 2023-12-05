import { useContext } from 'react';
import { DeviceContext, IDeviceContext } from '../DeviceContext';

export default function useDeviceContext(): IDeviceContext {
   const { isInForeground } = useContext(DeviceContext);
   return { isInForeground };
}
