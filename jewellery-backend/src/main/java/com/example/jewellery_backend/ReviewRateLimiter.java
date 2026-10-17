package com.example.jewellery_backend;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Component;

@Component
public class ReviewRateLimiter {

    private static final int MAX_REQUESTS = 5;
    private static final long WINDOW_MS = 60_000;

    private final ConcurrentHashMap<String, Window> windows =
            new ConcurrentHashMap<>();

    public boolean allowRequest(String clientKey) {
        long now = System.currentTimeMillis();

        Window window = windows.compute(clientKey, (key, current) -> {
            if (current == null || now - current.startTime >= WINDOW_MS) {
                return new Window(now);
            }

            current.count.incrementAndGet();
            return current;
        });

        return window.count.get() <= MAX_REQUESTS;
    }

    private static class Window {
        private final long startTime;
        private final AtomicInteger count = new AtomicInteger(1);

        private Window(long startTime) {
            this.startTime = startTime;
        }
    }
}
