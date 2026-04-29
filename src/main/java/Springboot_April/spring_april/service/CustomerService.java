package Springboot_April.spring_april.service;

import Springboot_April.spring_april.dto.CustomerRequest;
import Springboot_April.spring_april.dto.CustomerResponse;
import Springboot_April.spring_april.mapper.CustomerMapper;
import Springboot_April.spring_april.model.Customer;
import Springboot_April.spring_april.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final Springboot_April.spring_april.repository.OrderRepository orderRepository;

    public List<CustomerResponse> getAllActiveCustomers() {
        return customerRepository.findAll().stream()
                .filter(c -> c.getDeletedAt() == null)
                .map(this::mapToLoyaltyResponse)
                .toList();
    }

    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return mapToLoyaltyResponse(customer);
    }

    private CustomerResponse mapToLoyaltyResponse(Customer customer) {
        List<Springboot_April.spring_april.model.RestaurantOrder> orders = orderRepository.findByCustomer(customer);

        long totalOrders = orders.size();
        java.math.BigDecimal totalSpent = orders.stream()
                .map(Springboot_April.spring_april.model.RestaurantOrder::getFinalAmount)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        java.time.LocalDateTime lastVisit = orders.stream()
                .map(Springboot_April.spring_april.model.RestaurantOrder::getCreatedAt)
                .max(java.time.LocalDateTime::compareTo)
                .orElse(null);

        return customerMapper.toResponse(customer, totalOrders, totalSpent, lastVisit);
    }

    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        Customer customer = customerMapper.toEntity(request);
        return customerMapper.toResponse(customerRepository.save(customer));
    }

    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setName(request.name());
        customer.setPhone(request.phone());
        customer.setEmail(request.email());
        customer.setAddress(request.address());
        customer.setImagePath(request.imagePath());

        return customerMapper.toResponse(customerRepository.save(customer));
    }

    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customer.setDeletedAt(LocalDateTime.now());
        customerRepository.save(customer);
    }
}
