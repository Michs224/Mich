#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

struct hastTable{
	char name[100];
	struct hastTable *next;
};
hastTable *ht[26]={NULL};
hastTable *tampung[26];

int hash(char value[])
{
	int hashKey = 0;
	int len, i;
	len = strlen(value);
	for(i=0;i<len;i++){
		hashKey = hashKey + value[i];
	}
	char str[100];
	itoa(hashKey,str,10);
//	printf("%s\n",str);
	char str2[2],str3[2];
	int x=0;

		for(int j=0;j<strlen(str);j++){
//			printf("%cstr\n",str[j]);
			if((j+1)%2==0){
				str2[0]=str[j-1];
				str2[1]=str[j];
				x+=atoi(str2);
//				printf("%db\n",x);
//				printf("%sa\n",str2);
			}
			else if((j+1)==strlen(str)){
//				printf("%c\n\n",str[j]);
				str3[0]=str[j];

				x+=atoi(str3);
//				printf("%dc\n",x);
			}
		}
	
	if(x>25){
		x=x%26;
//		printf("%dv\n",x);
		return x;
	}
	else {
//		printf("%dn\n",x);
		return x;
	}
	
}

void insert(int key, char value[])
{
    hastTable* newptr = (struct hastTable*)malloc(sizeof(struct hastTable));
//    if (newptr == NULL)
//    {
//        return;
//    }

    strcpy(newptr->name, value);
    newptr->next = NULL;


    if (ht[key] == NULL)
    {
       ht[key] = newptr;
    }
 
    else
    {
        hastTable* predptr = ht[key];
//	    tampung=ht;
//        int keykey=key;
//        int check=0;
// 		key=0;
//        while(predptr!=NULL){
//        	if (strcmp(newptr->name,ht[key]->name)==0){
//        		ht[key]->next=newptr;
////       		ht[key]->next->next=NULL;
//        		break;
//			}
//        	else{
//        		check=1;
//			}
//			key++;
//		}
//		if(check==1){
//			ht[keykey]=newptr;
//		}
        while (true)
        {
            if (predptr->next == NULL)
            {
                predptr->next = newptr;
                break;
            }

            predptr = predptr->next;
        }
    }
}

void display(struct hastTable *ht[]){
//	struct hastTable *display=*ht;
	if(display==NULL){
		printf("HAST TABLE IS EMPTY\n");
		return;
	}
	int i=0;
	
	while(i<26){
		struct hastTable *display=ht[i];
//		struct hastTable *tamp=display;
		printf("H[%d]: ",i);
		while(display!=NULL){
			printf("%s ",display->name);
			display=display->next;
		}
//		printf("%s ",display->name);
		printf("\n");
		i++;
	}
//	*ht=*display;
}

int main(){	int x;
	char value[100];
	do{
			printf("Menu:\n1. Insert ke HT\n2. Delete\n3. Display\n4. Exit\n");
	printf("Pilih: "); scanf("%d",&x);
	
	switch(x){
		case 1:{
			printf("Nama yang ingin dimasukkan ke HT: ");
   		 	scanf(" %[^\n]",value);
    		int hashkey= hash(value);
    		insert(hashkey, value);
			break;
		}
    	case 2:
    		break;
    	case 3:
    		display(ht);
    		break;
    	default:
    		break;
	}
	}while(x!=4);
    
	return 0;
}
