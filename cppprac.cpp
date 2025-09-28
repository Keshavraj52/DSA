//4.odd even.
#include<iostream>
using namespace std;
int main(){
    int n;
    cin>>n;
    if (n&1){
        cout<<"number is odd";
    }
    else{
        cout<<"number is even";
    }
}

//5.comparing two numbers.
#include<iostream>
using namespace std;
int main(){
    int a,b;
    cin>>a>>b;
    if (a>b){
        cout<<"the a is greater than b";
    }
    else{
        cout<<"A is less than B";
    }
    
    
}
//6.positive or negative.

#include<iostream>
using namespace std;
int main(){
    int a;
    cin>>a;
    if (a>=0){
        cout<<"positive";
    }
    else{
        cout<<"negative";
    }
    
    
}

//7.printing numbers from 1 to n.

#include<iostream>
using namespace std;
int main(){
    int a;
    cin>>a;
    for (int i=1; i<=a; i++){
        cout<<i<<" ";
    }
    
    
}

//8.sum of n numbers.

#include<iostream>
using namespace std;
int main(){
    int a,b;
    cin>>a;
    b=0;
    for (int i=1; i<=a; i++){
        b=b+i;
    }
    cout<<b;
    
    
}

//9.multiplication table.

#include<iostream>
using namespace std;
int main(){
    int a,b;
    cin>>a;
    int sum;
    b=10;
    for (int i=1; i<=b; i++){
        sum=i*a;
        cout<<a<<"*"<<i<<"="<<sum<<endl;
        
    }
    
    
}

//10. ispalindrome or not.
#include<iostream>
#include<string>
using namespace std;

bool ispalindrome(string s){
    string cleaned="";
    for (char c: s){
        if (isalnum(c)) cleaned+=tolower(c);
    }
    int left, right=cleaned.size()-1;
    cout<<right;
    while (left<right)
    {
        /* code */
        if (cleaned[left]!=cleaned[right]){
            return false;
        }

        right--;
        left++;
    }
    
    return true;
}
int main(){
    string s;
    getline(cin,s);
    if (ispalindrome(s)) return true;
    else return false;
    return 0;

}


// frequency counter
#include <iostream>
#include <string>
#include <cctype>// for isalnum and tolower
using namespace std;

char mostFrequentChar(string s) {
    int freq[36] = {0}; 
    string cleaned = "";

    // Step 1: Clean the string
    for (char c : s) {
        if (isalnum(c)) {
            c = tolower(c);
            cleaned += c;
            if (isalpha(c)) freq[c - 'a']++;// a=97 z=122 freq['a'-'a']=freq[0] freq['z'-'a']=freq[25]
            else freq[26 + (c - '0')]++;// 0=48 9=57 ASCII values
        }
    }

    // Step 2: Find most frequent character
    int maxFreq = 0;
    char result = '\0';// null character

    for (char c : cleaned) {
        int idx = isalpha(c) ? c - 'a' : 26 + (c - '0');// index in freq array
        if (freq[idx] > maxFreq) {
            maxFreq = freq[idx]; 
            result = c;
        }
    }

    return result;
}

int main() {
    string s;
    getline(cin, s); // allows spaces
    cout << mostFrequentChar(s) << endl;
    return 0;
}



//spiral matrix

#include <iostream>
#include <vector>
using namespace std;

void spiralOrder(vector<vector<int>>& matrix, int m, int n) {
    int top = 0, bottom = m - 1;
    int left = 0, right = n - 1;

    while (top <= bottom && left <= right) {
        // Traverse from Left to Right
        for (int i = left; i <= right; i++)
            cout << matrix[top][i] << " ";
        top++;

        // Traverse from Top to Bottom
        for (int i = top; i <= bottom; i++)
            cout << matrix[i][right] << " ";
        right--;

        // Traverse from Right to Left
        if (top <= bottom) {
            for (int i = right; i >= left; i--)
                cout << matrix[bottom][i] << " ";
            bottom--;
        }

        // Traverse from Bottom to Top
        if (left <= right) {
            for (int i = bottom; i >= top; i--)
                cout << matrix[i][left] << " ";
            left++;
        }
    }
    cout << endl;
}

int main() {
    int m, n;
    cin >> m >> n;

    vector<vector<int>> matrix(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> matrix[i][j];

    spiralOrder(matrix, m, n);
    return 0;
}