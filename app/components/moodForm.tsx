import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

export const MoodForm = ({
  handleSubmit,
  handleMoodChange,
  submitting,
}: {
  handleSubmit: (event: React.FormEvent) => void
  handleMoodChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  submitting: boolean
}) => (
  <form className="mt-10 flex gap-4" onSubmit={handleSubmit}>
    {!submitting ? (
      <>
        <Input
          type="text"
          placeholder="I feel happy today"
          className="max-w-lg flex-1"
          onChange={handleMoodChange}
        />
        <Button
          type="submit"
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          variant={'default'}
        >
          Save
        </Button>
      </>
    ) : (
      <>
        <Button
          disabled
          className="flex items-center justify-center bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please Wait
        </Button>
      </>
    )}
  </form>
)
