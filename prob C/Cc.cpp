#include <stdio.h> 
#include <string.h> 
#include <stdlib.h> 
 
struct data { 
 int no; 
 char M[11]; 
}plant[100]; 
 
 
int main (){ 
 struct data tukar; 
 int T,x,y; 
 FILE *bts =fopen ("testdata.in","r"); 
  
 fscanf(bts,"%d",&T); 
 for(x=0;x<T;x++){ 
  fscanf(bts,"%d %s\n",&plant[x].no,&plant[x].M); 
 } 
  
 for(int i=0; i<x; i++) { 
  for(int j=x-1; j>i; j--) { 
   if(plant[j-1].no > plant[j].no) 
   { 
    tukar = plant[j]; 
    plant[j] = plant[j-1]; 
    plant[j-1] = tukar; 
   } 
  } 
 } 
  
 for(x=0;x<T;x++) 
 { 
  printf("%d %s\n",plant[x].no,plant[x].M); 
 } 
  
 fclose(bts); 
 return 0; 
}
