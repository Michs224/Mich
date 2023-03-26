#include "stdio.h"
#include "string.h"

int main(){
   int T;
   scanf("%d\n",&T);
   char str[T*T];
   char temp[T];
   int freq[T*T];
   int counter=0;
   
   char d;
   for (int x=0;x<T;x++){
      gets(temp);
      for(int y=0;y<strlen(temp);y++){
         str[counter] = temp[y];
         counter++;
      }
   }
   for(int i=0;i<T*T;i++){
      freq[i] = 0;
   }
   counter = 0;
   for(int i=0;i<T*T;i++){
      counter+=1;
      for(int j=i+1;j<T*T;j++){
         if(str[i] == str[j]){
            freq[j] = -1;
            counter++;
         }
      }
      if(freq[i] != -1){
         freq[i] = counter;
      }
      counter = 0;
   }
   for(int i=0;i<T*T;i++){
      if(str[i]>='a' && str[i]<='z'){
         if(freq[i]>0){
            printf("%c %d\n", str[i],freq[i]);      
         }
      }
   }
}


