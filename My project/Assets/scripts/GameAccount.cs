using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameAccount : MonoBehaviour
{
    public string _id;
    public string username;
    public int adminFlag;

    public void Load(string jsonString)
    {
        JsonUtility.FromJsonOverwrite(jsonString, this);
    }
}
