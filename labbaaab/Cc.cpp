#include <stdio.h> 
#include <string.h> 
#include <stdlib.h> 
 
struct data { 
 int R; 
 char M[11]; 
}plant[1001]; 
 
void BubbleSort(struct data, int x) 
{ 
 struct data tukar; 
  
 for(int i=0; i<x; i++) { 
  for(int j=x-1; j>i; j--) { 
   if(plant[j-1].R > plant[j].R) 
   { 
    tukar = plant[j]; 
    plant[j] = plant[j-1]; 
    plant[j-1] = tukar; 
   } 
  } 
 } 
} 
 
 
int main (){ 
 struct data tukar; 
 int T,x,y; 
 FILE *bts =fopen ("testdata.in","r"); 
  
 fscanf(bts,"%d\n",&T); 
 for(x=0;x<T;x++){ 
  fscanf(bts,"%d %s",&plant[x].R,&plant[x].M); 
 } 
  
 BubbleSort(plant[T], T); 
  
 for(x=0;x<T;x++) 
 { 
  printf("%d %s\n",plant[x].R,plant[x].M); 
 } 
  
 fclose(bts); 
 return 0; 
}
