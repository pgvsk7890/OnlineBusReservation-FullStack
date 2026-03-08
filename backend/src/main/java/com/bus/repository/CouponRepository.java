package com.bus.repository;

import com.bus.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Coupon findByCouponCode(String couponCode);
    List<Coupon> findByActiveTrue();
}
