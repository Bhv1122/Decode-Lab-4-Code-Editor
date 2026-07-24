import { CodePreset } from "../types";

export const CODE_PRESETS: CodePreset[] = [
  {
    id: "ts-async-leak",
    name: "TypeScript - Unhandled Async & Null Pointer",
    language: "typescript",
    filename: "user_processor.ts",
    description: "Contains unhandled promises, potential null pointer dereferences, missing error boundaries, and uninitialized properties.",
    code: `interface UserData {
  id?: number;
  profile?: {
    name: string;
    email: string;
  };
}

class UserProcessor {
  private cache: any;

  async fetchAndProcessUser(userId: number) {
    let res = fetch("https://api.example.com/users/" + userId);
    let data = (res as any).json();
    
    // Potential null pointer / unhandled undefined
    console.log("Processing user: " + data.profile.name.toUpperCase());

    this.cache[userId] = data;
    
    // Array off-by-one loop & unhandled array mutation
    for (let i = 0; i <= data.tags.length; i++) {
      this.processTag(data.tags[i]);
    }

    return data;
  }

  processTag(tag: string) {
    if (tag.length > 0)
      console.log("Tag: " + tag);
  }
}`
  },
  {
    id: "py-memory-leak",
    name: "Python - File Leak & Uncaught Exception",
    language: "python",
    filename: "data_ingestor.py",
    description: "Contains unclosed file descriptors, global variable mutation, mutable default arguments, and unsafe eval usage.",
    code: `import os, sys, json

global_records = []

def process_file_data(filepath, records_cache=[]):
    # Unclosed file descriptor resource leak
    f = open(filepath, 'r')
    raw_data = f.read()
    
    parsed = json.loads(raw_data)
    
    for item in parsed:
        # Off-by-one index error
        if len(item) > 0:
            first_char = item[100]
            records_cache.append(first_char)
            
    # Unsafe dynamic code execution
    exec_string = parsed.get("calc_rule")
    result = eval(exec_string)
    
    global_records.append(result)
    return records_cache

def calculate_average(numbers):
    total = 0
    # Division by zero vulnerability if numbers is empty or sums to zero
    for n in numbers:
        total += n
    return total / len(numbers)
`
  },
  {
    id: "js-closure-race",
    name: "JavaScript - Closure Memory Leak & Race Condition",
    language: "javascript",
    filename: "event_stream.js",
    description: "Features leaky event listeners, var closure scope bugs in loops, and unhandled promise rejections.",
    code: `function startStreamProcessor(urls) {
  var activeListeners = [];

  for (var i = 0; i < urls.length; i++) {
    // Closure bug: var inside setTimeout/async loop
    setTimeout(function() {
      fetch(urls[i]).then(function(res) {
        return res.json();
      }).then(function(data) {
        document.getElementById("status").innerText = "Processed URL " + i;
        window.addEventListener("resize", function() {
          console.log("Resized while handling " + data.id);
        });
      });
    }, 1000 * i);
  }
}

function computeTotals(items) {
  var total; // Undefined initial value
  items.forEach(function(item) {
    total += item.price;
  });
  return total;
}
`
  },
  {
    id: "cpp-dangling-ptr",
    name: "C++ - Memory Leak & Out-of-Bounds Access",
    language: "cpp",
    filename: "matrix_buffer.cpp",
    description: "Demonstrates raw dynamic memory allocation without delete, dangling pointers, and vector buffer overflow.",
    code: `#include <iostream>
#include <vector>
#include <cstring>

class MatrixBuffer {
private:
    int* data;
    size_t size;

public:
    MatrixBuffer(size_t s) {
        size = s;
        data = new int[s]; // Raw allocation
    }

    // Missing destructor, copy constructor, and copy assignment operator (Rule of 3/5 violation)

    void setValue(size_t index, int val) {
        // Out of bounds access bug (size vs index comparison error)
        if (index <= size) {
            data[index] = val;
        }
    }

    int* getDanglingPointer() {
        int tempVar = 42;
        return &tempVar; // Returning address of stack local variable
    }
};

int main() {
    MatrixBuffer* buf = new MatrixBuffer(10);
    buf->setValue(10, 100);
    std::cout << "Buffer initialized" << std::endl;
    // Missing delete buf -> Memory leak
    return 0;
}
`
  },
  {
    id: "go-goroutine-leak",
    name: "Go - Goroutine Leak & Unchecked Errors",
    language: "go",
    filename: "worker_pool.go",
    description: "Features unbuffered channel deadlock, goroutine leaks, and ignored error return values.",
    code: `package main

import (
	"fmt"
	"net/http"
	"io/ioutil"
)

func FetchData(urls []string) []string {
	ch := make(chan string) // Unbuffered channel can block worker goroutines indefinitely

	for _, url := range urls {
		go func(targetUrl string) {
			resp, err := http.Get(targetUrl)
			// Unchecked error handling
			if err != nil {
				return // Channel will never receive value -> main thread leaks
			}
			body, _ := ioutil.ReadAll(resp.Body) // Missing resp.Body.Close()
			ch <- string(body)
		}(url)
	}

	var results []string
	for i := 0; i < len(urls); i++ {
		results = append(results, <-ch)
	}

	return results
}

func main() {
	urls := []string{"https://httpbin.org/get", "invalid-url"}
	res := FetchData(urls)
	fmt.Printf("Fetched %d results\n", len(res))
}
`
  }
];
