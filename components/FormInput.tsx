import { Input, Label, YStack, Text } from 'tamagui';

type FormInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
};

export const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType = 'default',
}: FormInputProps) => {
  return (
    <YStack space="$1.5" mb="$4">
      <Label htmlFor={label} fontSize="$3" color="$flexpaBlack">
        {label}
      </Label>
      <Input
        id={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        size="$4"
        borderWidth={1}
        borderColor={error ? '$red10' : '$gray5'}
        borderRadius="$3"
        padding="$3"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
      {error && (
        <Text color="$red10" fontSize="$2">
          {error}
        </Text>
      )}
    </YStack>
  );
};
