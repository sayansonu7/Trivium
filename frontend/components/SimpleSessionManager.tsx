import { useSimpleSession } from '../hooks/useSimpleSession';
import DeviceSelectionModal from './DeviceSelectionModal';

export default function SimpleSessionManager() {
  const { 
    deviceLimitState, 
    forceCreateSession, 
    cancelDeviceSelection 
  } = useSimpleSession();

  return (
    <DeviceSelectionModal
      isOpen={deviceLimitState.isExceeded}
      sessions={deviceLimitState.sessions}
      maxDevices={deviceLimitState.maxDevices}
      onForceLogin={forceCreateSession}
      onCancel={cancelDeviceSelection}
    />
  );
}