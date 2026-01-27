'use client';

import { useState } from 'react';
import {
  useGetPaymentsQuery,
  useApprovePaymentMutation,
} from '@/redux/features/payment/paymentApi';

import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from '@/components/ui/table';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

import { VerifyPaymentModal } from '@/components/verifyPaymentModel';

const STATUS_TABS = [
  'ALL',
  'PENDING',
  'PAID',
  'REJECTED',
  'FAILED',
  'CANCELED',
];

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('PENDING');

  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [openVerify, setOpenVerify] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const { data, isLoading } = useGetPaymentsQuery({
    page,
    limit: 10,
    status: status === 'ALL' ? undefined : status,
    search,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [approvePayment, { isLoading: approving }] =
    useApprovePaymentMutation();

  const handleApprove = async () => {
    try {
      await approvePayment(selectedPayment._id).unwrap();
      toast.success('Payment approved successfully ✅');
      setOpenConfirm(false);
      setOpenVerify(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Approval failed ❌');
    }
  };

  if (isLoading) return <p className="p-6">Loading payments...</p>;

  return (
    <div className="p-6 space-y-4">

      {/* 🔘 STATUS TOGGLE */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={status === item ? 'default' : 'outline'}
            onClick={() => {
              setStatus(item);
              setPage(1);
            }}
          >
            {item}
          </Button>
        ))}
      </div>

      {/* 🔍 SEARCH */}
      <Input
        placeholder="Search name / email / phone"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* 📊 TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.data?.map((payment: any) => (
            <TableRow key={payment._id}>
              <TableCell>{payment.userId?.name}</TableCell>
              <TableCell>{payment.userId?.email}</TableCell>
              <TableCell>{payment.senderNumber}</TableCell>
              <TableCell>৳ {payment.amount}</TableCell>

              <TableCell>
                <Badge
                  variant={
                    payment.status === 'PAID'
                      ? 'default'
                      : payment.status === 'PENDING'
                      ? 'outline'
                      : 'destructive'
                  }
                >
                  {payment.status}
                </Badge>
              </TableCell>

              <TableCell>
                {payment.status === 'PENDING' ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedPayment(payment);
                      setOpenVerify(true);
                    }}
                  >
                    Verify
                  </Button>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              <TableCell>
                {new Date(payment.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 📄 PAGINATION */}
      <div className="flex justify-between items-center">
        <Button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>

        <p>
          Page {data.meta.page} of {data.meta.totalPages}
        </p>

        <Button
          disabled={page === data.meta.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      {/* 🔍 VERIFY MODAL */}
      <VerifyPaymentModal
        open={openVerify}
        onClose={() => setOpenVerify(false)}
        payment={selectedPayment}
        onConfirm={() => setOpenConfirm(true)}
        loading={approving}
      />

      {/* 🔐 CONFIRM DIALOG */}
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm Payment Approval
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this payment?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              disabled={approving}
            >
              {approving ? 'Approving...' : 'Yes, Approve'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
