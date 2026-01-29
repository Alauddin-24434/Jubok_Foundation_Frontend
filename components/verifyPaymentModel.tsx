import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  payment: any;
  onConfirm: () => void;
  loading: boolean;
};

export function VerifyPaymentModal({
  open,
  onClose,
  payment,
  onConfirm,
  loading,
}: Props) {
  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p>
            <b>Name:</b> {payment.userId?.name}
          </p>
          <p>
            <b>Email:</b> {payment.userId?.email}
          </p>
          <p>
            <b>Phone:</b> {payment.senderNumber}
          </p>
          <p>
            <b>Transaction ID:</b> {payment.transactionId}
          </p>
          <p>
            <b>Amount:</b> ৳ {payment.amount}
          </p>

          {payment.screenshot && (
            <img
              src={payment.screenshot}
              alt="Payment Proof"
              className="rounded border mt-2"
            />
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={onConfirm} disabled={loading}>
            {loading ? "Approving..." : "Approve"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
