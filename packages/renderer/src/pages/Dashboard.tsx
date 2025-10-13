import { Button } from '../components/buttons/Button';
import { RejectIcon } from '../components/icons/RejectIcon.tsx';

export function Dashboard() {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <Button
          size="md"
          variant="secondary"
          icon={<RejectIcon size={'1rem'}></RejectIcon>}
        >
          Reject
        </Button>
      </div>
    </>
  );
}
