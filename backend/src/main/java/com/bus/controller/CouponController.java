package com.bus.controller;

import com.bus.entity.Coupon;
import com.bus.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/coupon")
@CrossOrigin(origins = "http://localhost:5173")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @PostMapping("/create")
    public Coupon createCoupon(@RequestBody Coupon coupon) {
        return couponService.createCoupon(coupon);
    }

    @GetMapping("/all")
    public List<Coupon> getAllCoupons() {
        return couponService.getAllCoupons();
    }

    @GetMapping("/active")
    public List<Coupon> getActiveCoupons() {
        return couponService.getActiveCoupons();
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyCoupon(@RequestBody Map<String, Object> request) {
        try {
            String couponCode = (String) request.get("couponCode");
            int amount = (Integer) request.get("amount");
            
            Coupon coupon = couponService.validateCoupon(couponCode, amount);
            
            int discount = (amount * coupon.getDiscountPercentage()) / 100;
            if (coupon.getMaxDiscount() > 0 && discount > coupon.getMaxDiscount()) {
                discount = coupon.getMaxDiscount();
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "discount", discount,
                "coupon", coupon
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/delete/{id}")
    public void deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
    }

    @PutMapping("/update/{id}")
    public Coupon updateCoupon(@PathVariable Long id, @RequestBody Coupon coupon) {
        return couponService.updateCoupon(id, coupon);
    }
}
