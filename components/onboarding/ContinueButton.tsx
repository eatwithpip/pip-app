import Button from '@/components/ui/Button';

interface Props {
  onPress: () => void;
  enabled: boolean;
  label?: string;
}

export default function ContinueButton({ onPress, enabled, label = 'Continue' }: Props) {
  return <Button label={label} onPress={onPress} variant="primary" disabled={!enabled} />;
}
