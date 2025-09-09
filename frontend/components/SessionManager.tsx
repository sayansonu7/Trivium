import { useSession } from '../hooks/useSession';
import DeviceSelectionModal from './DeviceSelectionModal';

export default function SessionManager() {
  const { 
    deviceLimitState, 
    forceCreateSession, 
    cancelDeviceSelection 
  } = useSession();

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