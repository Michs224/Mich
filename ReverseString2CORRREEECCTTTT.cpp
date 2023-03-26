#include<stdio.h>
 
int string_length(char*);
void reverse(char*);
 
main()
{
   char s[1000];
   int x,N;
   
   scanf("%d",&N);
   for(x=1;x<=N;x++){
   
	scanf("%s",&s);
   
 
   reverse(s);
 
   printf("Case #%d : %s\n",x,s);
 	}
   return 0;
}
 
void reverse(char *s)
{
   int length, c;
   char *begin, *end, temp;
 
   length = string_length(s);
   begin  = s;
   end    = s;
 
   for (c = 0; c < length - 1; c++)
      end++;
 
   for (c = 0; c < length/2; c++)
   {        
      temp   = *end;
      *end   = *begin;
      *begin = temp;
 
      begin++;
      end--;
   }
}
int string_length(char *pointer)
{
   int c = 0;
 
   while( *(pointer + c) != '\0' )
      c++;
 
   return c;
}
