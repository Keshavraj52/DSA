# title: selection sort algorithm implementation
# Athor: keshavraj Pore
# description: this code is for sorting array and the time complexity is O(n^2) and space complexity is O(1). 

class SortingArray:
    def __init__(self,arr):
        self.arr=arr

    def selectionSort(self, arr):
        if len(self.arr)<=1:
            return self.arr
        for i in range(len(self.arr)):
            min_index=i
            for j in range(len(self.arr)):
                if self.arr[i]<self.arr[j]:
                    min_index=j
                self.arr[i], self.arr[j]=self.arr[j], self.arr[i]
        return self.arr
    
    def bubbleSort(self,arr):
        for i in range(len(self.arr)):
            swap=0
            for j in range(len(arr)-i-1):
                if self.arr[j]<self.arr[i]:
                    self.arr[j], self.arr[i]=self.arr[i], self.arr[j]
                    swap+=1
            if swap==0:
                return self.arr    
        return self.arr
    def insertionSort(self, arr):
        if len(arr)<=1:
            return arr
        for i in range(len(arr)):
            key=arr[i]
            j=i-1
            while j>=0 and arr[j]>key:
                arr[j+1]=arr[j]
                j-=1
            arr[j+1]=arr[i]
        return arr


    
arr=[1234,32,42,53,4424]
SortClass=SortingArray(arr)

print(SortClass.insertionSort())
