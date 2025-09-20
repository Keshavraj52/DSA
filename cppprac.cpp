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