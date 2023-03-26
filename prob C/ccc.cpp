#include <stdio.h> 
#include <string.h> 
#include <stdlib.h> 

struct data { 
 int R; 
 char M[101]; 
}reve[1000]; 
void BubbleSort(struct data, int x) { 
 struct data wendy; 
 for(int i=1; i<=x; i++) { 
  for(int j=x-1; j>=1; j--) { 
   if(reve[j-1].R > reve[j].R) 
   { 
    wendy =reve[j]; 
    reve[j] = reve[j-1]; 
   	reve[j-1] = wendy; 
   } 
  } 
 } 
} 
int main (){ 
 struct data wendy; 
 int T,x,y; 
 FILE *bts =fopen ("testdata.in","r"); 
 fscanf(bts,"%d",&T); 
 for(x=0;x<T;x++){ 
  fscanf(bts,"%d %s",&reve[x].R,&reve[x].M); 
 } 
 BubbleSort(reve[T], T); 
 
 for(x=0;x<T;x++){ 
  printf("%d %s\n",reve[x].R,reve[x].M); 
 } 
 fclose(bts); 
 return 0; 
}
