import React, { useState, useMemo } from 'react';
import { useStorage } from './hooks/useStorage';
import CouponForm from './CouponForm';
import Card from './Card';
import Button from './Button';

const CouponManagement = () => {
  const [data, setData] = useStorage("admin_data_v1");
  const [showForm, setShowForm] = useState(false);

  const coupons = data.coupons || [];

  const handleCreateCoupon = (newCoupon) => {
    setData(prev => ({
      ...prev,
      coupons: [...(prev.coupons || []), newCoupon]
    }));
    setShowForm(false);
  };

  const handleDeleteCoupon = (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setData(prev => ({
        ...prev,
        coupons: prev.coupons.filter(c => c.id !== couponId)
      }));
    }
  };

  const isCouponValid = (coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validTo = new Date(coupon.validTo);
    return now >= validFrom && now <= validTo && coupon.used < coupon.usageLimit;
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Coupon Management</h2>
          <p className="text-gray-600 mt-1">
            {coupons.length} coupon{coupons.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button
          variant="success"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <span>+</span>
          Create Coupon
        </Button>
      </div>

      {showForm && (
        <CouponForm 
          onCreate={handleCreateCoupon}
        />
      )}

      {coupons.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-4">🎫</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No coupons yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first coupon to offer discounts to customers
          </p>
          <Button
            variant="success"
            onClick={() => setShowForm(true)}
          >
            Create First Coupon
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <Card key={coupon.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{coupon.id}</h3>
                  <p className="text-sm text-gray-600">
                    {coupon.type === 'percent' ? `${coupon.value}% off` : `₹${coupon.value} off`}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isCouponValid(coupon)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isCouponValid(coupon) ? 'Active' : 'Expired'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div>Used: {coupon.used}/{coupon.usageLimit}</div>
                <div>Valid: {coupon.validFrom} to {coupon.validTo}</div>
              </div>
              
              <div className="mt-4">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteCoupon(coupon.id)}
                  className="w-full"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default CouponManagement;