'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { useInitiatePaymentMutation } from '@/redux/features/payment/paymentApi';

type PaymentType = 'MEMBERSHIP' | 'MONTHLY_FUND';

export default function PaymentPage() {
  const [initiatePayment, { isLoading }] =
    useInitiatePaymentMutation();

  const [paymentType, setPaymentType] =
    useState<PaymentType>('MEMBERSHIP');

  const [form, setForm] = useState({
    amount: 500,
    method: 'BKASH',
    purpose: 'ACCOUNT_ACTIVATION',
    senderNumber: '',
    transactionId: '',
  });

  // 🔁 handle payment type change
  const handleTypeChange = (type: PaymentType) => {
    if (type === 'MEMBERSHIP') {
      setForm({
        ...form,
        amount: 1000,
        purpose: 'ACCOUNT_ACTIVATION',
      });
    } else {
      setForm({
        ...form,
        amount: 1000,
        purpose: 'MONTHLY_FUND',
      });
    }
    setPaymentType(type);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await initiatePayment(form).unwrap();
      toast.success(
        'Payment submitted. Waiting for admin approval.',
      );
      setForm({
        ...form,
        senderNumber: '',
        transactionId: '',
      });
    } catch (err: any) {
      toast.error(err?.data?.message || 'Payment failed');
    }
  };

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">
          Manual Payment
        </h1>

        {/* 🔘 Payment Type */}
        <div className="space-y-2">
          <Label>Payment Type</Label>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentType"
                checked={paymentType === 'MEMBERSHIP'}
                onChange={() =>
                  handleTypeChange('MEMBERSHIP')
                }
              />
              Membership
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentType"
                checked={paymentType === 'MONTHLY_FUND'}
                onChange={() =>
                  handleTypeChange('MONTHLY_FUND')
                }
              />
              Monthly Fund
            </label>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label>Amount</Label>
            <Input value={form.amount} disabled />
          </div>

          <div>
            <Label>Payment Method</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.method}
              onChange={(e) =>
                setForm({
                  ...form,
                  method: e.target.value,
                })
              }
            >
              <option value="BKASH">bKash</option>
              <option value="NAGAD">Nagad</option>
              <option value="BANK">Bank</option>
              <option value="CASH">Cash</option>
            </select>
          </div>

          <div>
            <Label>Sender Number</Label>
            <Input
              required
              placeholder="01XXXXXXXXX"
              value={form.senderNumber}
              onChange={(e) =>
                setForm({
                  ...form,
                  senderNumber: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Transaction ID</Label>
            <Input
              required
              placeholder="bKash TrxID"
              value={form.transactionId}
              onChange={(e) =>
                setForm({
                  ...form,
                  transactionId: e.target.value,
                })
              }
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading
              ? 'Submitting...'
              : 'Submit Payment'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
