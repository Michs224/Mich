#include <stdio.h>

int main()
{
	char str[1000]={0};	
	int i;
	
	printf("Masukan kalimat: ");
	scanf("%[^\n]s",str);
	
	for(i=0; str[i]!='\0'; i++)
	{
		if(i==0)
		{
			if((str[i]>='a' && str[i]<='z'))
				str[i]=str[i]-32; //Kenapa -32? Biar jadi huruf kapital
			continue; 
		}
		if(str[i]==' ')
		{
			++i;
			if(str[i]>='a' && str[i]<='z')
			{
				str[i]=str[i]-32; 
				continue; 
			}
		}
		else
		{
			
			if(str[i]>='A' && str[i]<='Z')
				str[i]=str[i]+32; // Kenapa 32? Biar huruf kecil
		}
	}
	
	printf("Hasil adalah: %s\n",str);
	
	return 0;
}
