// removeduplicate.cpp
// This program removes duplicates from an array while maintaining the original order of elements.

#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

vector<int> removeDuplicatesArray(vector<int> arr) {
    unordered_set<int> seen;// to track seen elements
    vector<int> result;

    for (int x : arr) {
        if (seen.find(x) == seen.end()) { // not seen before
            result.push_back(x);
            seen.insert(x);
        }
    }
    return result;
}

int main() {
    vector<int> arr = {4, 5, 9, 4, 9, 8, 5};
    vector<int> res = removeDuplicatesArray(arr);

    cout << "Array after removing duplicates: ";
    for (int x : res) cout << x << " ";
    return 0;
}



// removeduplicate.cpp
// This program removes duplicates from a string while maintaining the original order of characters.
#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

string removeDuplicatesString(string s) {
    unordered_set<char> seen;
    string result = "";

    for (char c : s) {
        if (seen.find(c) == seen.end()) { // not seen before
            result += c;
            seen.insert(c);
        }
    }
    return result;
}

int main() {
    string s = "programming";
    cout << "String after removing duplicates: " 
         << removeDuplicatesString(s) << endl;
    return 0;
}



// removeduplicate.cpp
// This program merges overlapping intervals in a list of intervals.


#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
    // Step 1: Sort by start time
    sort(intervals.begin(), intervals.end());

    vector<vector<int>> merged;
    // Step 2: Traverse intervals
    for (auto interval : intervals) {
        // If empty OR no overlap
        if (merged.empty() || merged.back()[1] < interval[0]) {
            merged.push_back(interval);
        } else {
            // Overlap case → merge
            merged.back()[1] = max(merged.back()[1], interval[1]);
        }
    }
    return merged;
}

int main() {
    int n;
    cout << "Enter number of intervals: ";
    cin >> n;

    vector<vector<int>> intervals(n, vector<int>(2));
    cout << "Enter intervals (start end):" << endl;
    for (int i = 0; i < n; i++) {
        cin >> intervals[i][0] >> intervals[i][1];
    }

    vector<vector<int>> ans = mergeIntervals(intervals);

    cout << "Merged intervals: ";
    for (auto v : ans) {
        cout << "[" << v[0] << "," << v[1] << "] ";
    }
    cout << endl;

    return 0;
}
