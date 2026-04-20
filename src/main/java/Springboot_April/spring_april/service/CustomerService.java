package Springboot_April.spring_april.service;

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
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public List<Customer> getAllActiveCustomers() {
        // Simple filter for now; real apps might use a specification or custom repository method
        return customerRepository.findAll().stream()
                .filter(c -> c.getDeletedAt() == null)
                .toList();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    @Transactional
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer updateCustomer(Long id, Customer details) {
        Customer customer = getCustomerById(id);
        customer.setName(details.getName());
        customer.setPhone(details.getPhone());
        customer.setEmail(details.getEmail());
        return customerRepository.save(customer);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customer.setDeletedAt(LocalDateTime.now());
        customerRepository.save(customer);
    }
}
