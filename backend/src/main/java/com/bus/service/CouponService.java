package com.bus.service;

import com.bus.entity.Coupon;
import com.bus.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public List<Coupon> getActiveCoupons() {
        return couponRepository.findByActiveTrue();
    }

    public Coupon validateCoupon(String couponCode, int amount) {
        Coupon coupon = couponRepository.findByCouponCode(couponCode);
        
        if (coupon == null) {
            throw new RuntimeException("Invalid coupon code");
        }

        if (!coupon.isActive()) {
            throw new RuntimeException("Coupon is no longer active");
        }

        LocalDate validUntil = LocalDate.parse(coupon.getValidUntil());
        if (LocalDate.now().isAfter(validUntil)) {
            throw new RuntimeException("Coupon has expired");
        }

        if (coupon.getUsageLimit() > 0 && coupon.getUsageCount() >= coupon.getUsageLimit()) {
            throw new RuntimeException("Coupon usage limit exceeded");
        }

        if (amount < coupon.getMinAmount()) {
            throw new RuntimeException("Minimum amount of " + coupon.getMinAmount() + " required");
        }

        int discount = (amount * coupon.getDiscountPercentage()) / 100;
        
        if (coupon.getMaxDiscount() > 0 && discount > coupon.getMaxDiscount()) {
            discount = coupon.getMaxDiscount();
        }

        return coupon;
    }

    public Coupon consumeCoupon(String couponCode, int amount) {
        Coupon coupon = validateCoupon(couponCode, amount);
        coupon.setUsageCount(coupon.getUsageCount() + 1);
        return couponRepository.save(coupon);
    }

    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }

    public Coupon updateCoupon(Long id, Coupon coupon) {
        Coupon existing = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        
        existing.setCouponCode(coupon.getCouponCode());
        existing.setDiscountPercentage(coupon.getDiscountPercentage());
        existing.setValidUntil(coupon.getValidUntil());
        existing.setActive(coupon.isActive());
        existing.setMinAmount(coupon.getMinAmount());
        existing.setMaxDiscount(coupon.getMaxDiscount());
        existing.setUsageLimit(coupon.getUsageLimit());
        existing.setDescription(coupon.getDescription());
        
        return couponRepository.save(existing);
    }
}
